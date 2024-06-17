import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { marked } from 'marked';

export async function POST(req: NextRequest) {
  const { email, title, description } = await req.json();

  if (!email || !title || !description) {
    return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
  }

  try {
    var transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "ca7ef1509cdff4",
        pass: "15c07202c2b5e1"
      }
    });

    // Convert Markdown to HTML
    const htmlDescription = marked(description);

    const mailOptions = {
      from: process.env.SMTP_FROM, // sender address
      to: email, // list of receivers
      subject: `New Issue Assigned: ${title}`, // Subject line
      html: `
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
