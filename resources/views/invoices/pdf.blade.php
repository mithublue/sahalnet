<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Invoice {{ $invoice->invoice_number }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #4F46E5;
            padding-bottom: 20px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #4F46E5;
        }
        .invoice-title {
            font-size: 20px;
            font-weight: bold;
            margin-top: 10px;
        }
        .info-section {
            margin-bottom: 20px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }
        .info-box {
            width: 48%;
        }
        .info-box h3 {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #4F46E5;
        }
        .info-box p {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table th {
            background-color: #4F46E5;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
        }
        .text-right {
            text-align: right;
        }
        .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
        }
        .totals table {
            margin: 0;
        }
        .totals table td {
            border: none;
            padding: 5px 10px;
        }
        .total-row {
            font-weight: bold;
            font-size: 14px;
            background-color: #f3f4f6;
        }
        .status-badge {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 11px;
            font-weight: bold;
        }
        .status-paid {
            background-color: #D1FAE5;
            color: #065F46;
        }
        .status-unpaid {
            background-color: #FEE2E2;
            color: #991B1B;
        }
        .status-partial {
            background-color: #FEF3C7;
            color: #92400E;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 20px;
        }
        .notes {
            margin-top: 30px;
            padding: 15px;
            background-color: #f9fafb;
            border-left: 3px solid #4F46E5;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">{{ config('app.name') }}</div>
        <div class="invoice-title">INVOICE</div>
    </div>

    <div class="info-section">
        <div class="info-row">
            <div class="info-box">
                <h3>Invoice Information</h3>
                <p><strong>Invoice Number:</strong> {{ $invoice->invoice_number }}</p>
                <p><strong>Invoice Date:</strong> {{ $invoice->invoice_date->format('d M Y') }}</p>
                <p><strong>Due Date:</strong> {{ $invoice->due_date->format('d M Y') }}</p>
                <p>
                    <strong>Status:</strong>
                    <span class="status-badge status-{{ $invoice->payment_status }}">
                        {{ strtoupper($invoice->payment_status) }}
                    </span>
                </p>
            </div>

            <div class="info-box">
                <h3>Bill To</h3>
                <p><strong>{{ $invoice->customer->name }}</strong></p>
                <p>Customer ID: {{ $invoice->customer->customer_id }}</p>
                <p>Phone: {{ $invoice->customer->phone }}</p>
                <p>Email: {{ $invoice->customer->email }}</p>
                @if($invoice->customer->address)
                    <p>{{ $invoice->customer->address }}</p>
                @endif
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Amount</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->items as $item)
                <tr>
                    <td>{{ $item->description }}</td>
                    <td class="text-right">{{ $item->quantity }}</td>
                    <td class="text-right">৳{{ number_format($item->unit_price, 2) }}</td>
                    <td class="text-right">৳{{ number_format($item->amount, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">৳{{ number_format($invoice->subtotal, 2) }}</td>
            </tr>
            @if($invoice->tax_amount > 0)
                <tr>
                    <td>Tax:</td>
                    <td class="text-right">৳{{ number_format($invoice->tax_amount, 2) }}</td>
                </tr>
            @endif
            @if($invoice->discount_amount > 0)
                <tr>
                    <td>Discount:</td>
                    <td class="text-right">-৳{{ number_format($invoice->discount_amount, 2) }}</td>
                </tr>
            @endif
            <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">৳{{ number_format($invoice->total_amount, 2) }}</td>
            </tr>
            @if($invoice->paid_amount > 0)
                <tr>
                    <td>Paid:</td>
                    <td class="text-right" style="color: #059669;">৳{{ number_format($invoice->paid_amount, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td>Balance Due:</td>
                    <td class="text-right" style="color: #DC2626;">৳{{ number_format($invoice->balance_due, 2) }}</td>
                </tr>
            @endif
        </table>
    </div>

    <div style="clear: both;"></div>

    @if($invoice->notes)
        <div class="notes">
            <strong>Notes:</strong><br>
            {{ $invoice->notes }}
        </div>
    @endif

    <div class="footer">
        <p>Thank you for your business!</p>
        <p>Generated on {{ now()->format('d M Y H:i') }}</p>
    </div>
</body>
</html>
