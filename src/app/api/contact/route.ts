import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // In production, send this to an email service or CRM
    console.log("Contact form submission:", { name, email, subject, message })

    return NextResponse.json({ success: true, message: "Message sent successfully" })
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
