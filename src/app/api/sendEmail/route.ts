import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { marked } from 'marked';

export async function POST(req: NextRequest) {
  const { email, title, description } = await req.json();

  if (!email || !title || !description) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Convert Markdown to HTML
    const htmlDescription = marked(description);

    const mailOptions = {
      from: process.env.SMTP_FROM, // sender address
      to: email, // list of receivers
      subject: `New Issue Assigned: ${title}`, // Subject line
      html: `
        <p>You have been assigned an issue.</p>
        <h2>${title}</h2>
        <div>${htmlDescription}</div>
      `, // HTML body
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 });
  }
}
