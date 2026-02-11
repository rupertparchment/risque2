import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-auth'
import { jsPDF } from 'jspdf'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authorization - get email from header or query param
    const email = request.headers.get('x-admin-email') || request.nextUrl.searchParams.get('email')
    
    // Check if it's env var login
    const adminEmail = process.env.ADMIN_EMAIL
    const isEnvVarLogin = email === adminEmail
    
    // If not env var login, verify via AdminUser table
    if (!isEnvVarLogin) {
      const adminUser = await verifyAdminAccess(email)
      if (!adminUser) {
        return NextResponse.json(
          { error: 'Unauthorized. Administrator access required.' },
          { status: 403 }
        )
      }
    }

    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        event: {
          select: {
            id: true,
            title: true,
            eventDate: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json(
        { error: 'Payment not found' },
        { status: 404 }
      )
    }

    // Create PDF document (Letter size: 8.5 x 11 inches)
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'letter',
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    let yPos = margin

    // Check if this is a refund
    const isRefund = payment.status === 'refunded'

    // Helper function to add text with word wrap
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number, isBold: boolean = false, align: 'left' | 'center' | 'right' = 'left') => {
      doc.setFontSize(fontSize)
      doc.setFont('helvetica', isBold ? 'bold' : 'normal')
      const lines = doc.splitTextToSize(text, maxWidth)
      doc.text(lines, x, y, { align })
      return lines.length * (fontSize * 0.35) + 2 // Approximate line height + spacing
    }

    // Header
    const headerHeight = addText('RISQUÉ CLUB', pageWidth / 2, yPos, pageWidth - 2 * margin, 24, true, 'center')
    yPos += headerHeight + 3
    doc.setTextColor(0, 0, 0) // Reset to black
    const receiptType = isRefund ? 'REFUND RECEIPT' : 'PAYMENT RECEIPT'
    const receiptHeaderHeight = addText(receiptType, pageWidth / 2, yPos, pageWidth - 2 * margin, 16, false, 'center')
    yPos += receiptHeaderHeight + 10

    // Receipt details
    const receiptInfoHeight = addText('Receipt Information', margin, yPos, pageWidth - 2 * margin, 12, true)
    yPos += receiptInfoHeight
    doc.setDrawColor(0, 0, 0)
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 7
    
    const receiptDate = new Date(payment.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    yPos += addText(`Receipt Number: ${payment.id}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    yPos += addText(`Date: ${receiptDate}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    yPos += addText(`Status: ${payment.status.toUpperCase()}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    if (payment.stripePaymentId) {
      yPos += addText(`Transaction ID: ${payment.stripePaymentId}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    }
    yPos += 10

    // Member information
    const memberInfoHeight = addText('Member Information', margin, yPos, pageWidth - 2 * margin, 12, true)
    yPos += memberInfoHeight
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 7
    yPos += addText(`Name: ${payment.user.firstName} ${payment.user.lastName}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    yPos += addText(`Email: ${payment.user.email}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    yPos += 10

    // Payment details
    const paymentDetailsHeight = addText('Payment Details', margin, yPos, pageWidth - 2 * margin, 12, true)
    yPos += paymentDetailsHeight
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 7
    const paymentType = payment.paymentType.charAt(0).toUpperCase() + payment.paymentType.slice(1)
    yPos += addText(`Payment Type: ${paymentType}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
    
    if (payment.event) {
      yPos += addText(`Event: ${payment.event.title}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
      if (payment.event.eventDate) {
        const eventDate = new Date(payment.event.eventDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        yPos += addText(`Event Date: ${eventDate}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 10, false)
      }
    }
    yPos += 10

    // Amount
    const amountLabel = isRefund ? 'Amount Refunded' : 'Amount Paid'
    const amountLabelHeight = addText(amountLabel, margin, yPos, pageWidth - 2 * margin, 14, true)
    yPos += amountLabelHeight
    doc.line(margin, yPos, pageWidth - margin, yPos)
    yPos += 7
    yPos += addText(`$${payment.amount.toFixed(2)} ${payment.currency.toUpperCase()}`, margin + 10, yPos, pageWidth - 2 * margin - 10, 18, true)
    yPos += 15

    // Footer
    doc.setTextColor(102, 102, 102) // Gray color
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const footerText = isRefund 
      ? 'This is an official refund receipt from Risqué Club.'
      : 'Thank you for your payment. This is an official receipt from Risqué Club.'
    const footerLines = doc.splitTextToSize(footerText, pageWidth - 2 * margin)
    doc.text(footerLines, pageWidth / 2, pageHeight - margin, { align: 'center' })

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF as response
    const filename = isRefund ? `refund-receipt-${payment.id}.pdf` : `receipt-${payment.id}.pdf`
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: any) {
    console.error('Failed to generate receipt PDF:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate receipt' },
      { status: 500 }
    )
  }
}
