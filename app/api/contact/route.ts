import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

interface ContactFormData {
  name: string
  email: string
  company?: string
  subject: string
  message: string
  /** Optional "How did you hear about us?" answer. */
  source?: string
}

async function sendSlackNotification(data: ContactFormData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.warn('Slack webhook URL not configured - skipping notification')
    return null
  }

  const timestamp = new Date().toLocaleString('en-US', {
    timeZone: 'America/Los_Angeles',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const payload = {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "New Contact Form Submission",
          emoji: true
        }
      },
      {
        type: "divider"
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Name:*\n${data.name}`
          },
          {
            type: "mrkdwn",
            text: `*Email:*\n${data.email}`
          }
        ]
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Company:*\n${data.company || 'N/A'}`
          },
          {
            type: "mrkdwn",
            text: `*Subject:*\n${data.subject}`
          }
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Message:*\n${data.message}`
        }
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*How they heard about us:*\n${data.source || 'Not given'}`
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Submitted at ${timestamp} PT`
          }
        ]
      }
    ]
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`Slack webhook failed: ${response.status}`)
    }

    return true
  } catch (error) {
    console.error('Slack notification error:', error)
    // Don't throw - we don't want Slack failure to break the form
    return false
  }
}

async function appendToGoogleSheet(data: ContactFormData) {
  // Check if Google credentials are configured
  if (
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY ||
    !process.env.GOOGLE_SHEET_ID
  ) {
    console.warn('Google Sheets credentials not configured - skipping sheet update')
    return null
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // The private key needs newlines to be properly formatted
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    const timestamp = new Date().toISOString()

    // Append a row to the sheet
    // Assumes headers: Timestamp | Name | Email | Company | Subject | Message | Source
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A:G', // Adjust if your sheet has a different name
      valueInputOption: 'RAW', // RAW: user input is never parsed as a formula
      requestBody: {
        values: [[
          timestamp,
          data.name,
          data.email,
          data.company || '',
          data.subject,
          data.message,
          data.source || '',
        ]],
      },
    })

    return response.data
  } catch (error) {
    console.error('Error appending to Google Sheet:', error)
    throw error
  }
}

// Per-IP limit on contact submissions: each one writes a Sheets row and posts
// to Slack. In memory, so it is per Cloud Run instance (max 10): enough to stop
// one script flooding the sheet, not a distributed attack.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const recentSubmissions = new Map<string, number[]>()

// Cloud Run appends the connecting IP to X-Forwarded-For; via the Google load
// balancer that IP is the LB's (35.191.0.0/16 or 130.211.0.0/22) and the client
// is the entry before it. Anything further left is client-supplied.
function isGoogleLbIp(ip: string): boolean {
  const [a, b, c] = ip.split('.').map(Number)
  return (a === 35 && b === 191) || (a === 130 && b === 211 && c >= 0 && c <= 3)
}

function clientIp(request: NextRequest): string {
  const hops = (request.headers.get('x-forwarded-for') ?? '').split(',').map((s) => s.trim()).filter(Boolean)
  for (let i = hops.length - 1; i >= 0; i--) {
    if (!isGoogleLbIp(hops[i])) return hops[i]
  }
  return 'unknown'
}

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (recentSubmissions.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  const limited = recent.length >= RATE_LIMIT
  if (!limited) recent.push(now)
  recentSubmissions.set(ip, recent)
  if (recentSubmissions.size > 10_000) {
    for (const [key, times] of recentSubmissions) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) recentSubmissions.delete(key)
    }
  }
  return limited
}

export async function POST(request: NextRequest) {
  if (rateLimited(clientIp(request))) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Run Google Sheets and Slack notification in parallel
    await Promise.allSettled([
      appendToGoogleSheet(body),
      sendSlackNotification(body)
    ])

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form submission error:', error)

    // Even if Google Sheets fails, we don't want to fail the whole submission
    // since EmailJS already sent the email from the client
    return NextResponse.json(
      { success: true, message: 'Email sent, but backup save may have failed' },
      { status: 200 }
    )
  }
}
