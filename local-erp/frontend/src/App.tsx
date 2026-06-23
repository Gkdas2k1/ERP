import React, { useState } from "react";
import "./index.css";

// --- Inline SVG Icons for self-contained visual excellence ---
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
);
const InventoryIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);
const AccountingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
);
const TransactionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>
);
const SettingsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [dbConnected, setDbConnected] = useState<boolean>(true);

  // Settings State
  const [companyName, setCompanyName] = useState<string>("Acme Corporation Ltd.");
  const [currency, setCurrency] = useState<string>("USD ($)");
  const [taxId, setTaxId] = useState<string>("TX-9876543-B");

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Quick Stats Metrics */}
            <div className="metrics-grid">
              <div className="metric-card glass-card">
                <div className="metric-header">
                  <span>Total Revenue (MTD)</span>
                  <TransactionsIcon />
                </div>
                <div className="metric-value">$48,250.00</div>
                <div className="metric-footer">
                  <span className="trend-up">↑ +12.4%</span> since last month
                </div>
              </div>
              <div className="metric-card glass-card">
                <div className="metric-header">
                  <span>Stock Items</span>
                  <InventoryIcon />
                </div>
                <div className="metric-value">1,248</div>
                <div className="metric-footer">
                  <span className="trend-up">48 new items</span> added this week
                </div>
              </div>
              <div className="metric-card glass-card">
                <div className="metric-header">
                  <span>Net Ledger Balance</span>
                  <AccountingIcon />
                </div>
                <div className="metric-value">$182,450.00</div>
                <div className="metric-footer">
                  <span className="trend-up">↑ +3.2%</span> asset growth
                </div>
              </div>
              <div className="metric-card glass-card">
                <div className="metric-header">
                  <span>Open Invoices</span>
                  <TransactionsIcon />
                </div>
                <div className="metric-value">14</div>
                <div className="metric-footer">
                  <span className="trend-down">↓ 3 overdue</span> requires follow up
                </div>
              </div>
            </div>

            {/* Dashboard Panels */}
            <div className="sections-grid">
              {/* Recent Invoices Panel */}
              <div className="section-panel glass-card">
                <div className="section-title">
                  <span>Recent Invoices</span>
                  <span style={{ fontSize: "12px", color: "var(--accent-primary)", cursor: "pointer" }}>View All</span>
                </div>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Invoice No.</th>
                      <th>Customer</th>
                      <th>Due Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>INV-2026-004</td>
                      <td>Nexus Logistics</td>
                      <td>2026-07-10</td>
                      <td>$12,450.00</td>
                      <td><span className="badge badge-success">Paid</span></td>
                    </tr>
                    <tr>
                      <td>INV-2026-005</td>
                      <td>Vortex Media Group</td>
                      <td>2026-07-15</td>
                      <td>$3,800.00</td>
                      <td><span className="badge badge-warning">Draft</span></td>
                    </tr>
                    <tr>
                      <td>INV-2026-006</td>
                      <td>Zenith Retailers</td>
                      <td>2026-06-30</td>
                      <td>$8,200.00</td>
                      <td><span className="badge badge-info">Open</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Low Stock Alerts */}
              <div className="section-panel glass-card">
                <div className="section-title">
                  <span>Low Stock Warnings</span>
                </div>
                <div className="recent-list">
                  <div className="list-item">
                    <div className="item-left">
                      <div className="item-icon">📦</div>
                      <div className="item-details">
                        <span className="item-title">Ryzen 9 7950X CPU</span>
                        <span className="item-subtitle">SKU: CPU-RYZ-7950X</span>
                      </div>
                    </div>
                    <div className="item-right">
                      <span style={{ color: "var(--status-danger)" }}>2 left</span>
                    </div>
                  </div>
                  <div className="list-item">
                    <div className="item-left">
                      <div className="item-icon">📦</div>
                      <div className="item-details">
                        <span className="item-title">DDR5 32GB RAM Kit</span>
                        <span className="item-subtitle">SKU: MEM-DDR5-032G</span>
                      </div>
                    </div>
                    <div className="item-right">
                      <span style={{ color: "var(--status-warning)" }}>8 left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "inventory":
        return (
          <div className="section-panel glass-card">
            <div className="section-title">
              <span>Inventory Warehouse Items</span>
              <button style={{ background: "var(--accent-gradient)", border: "none", color: "#fff", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "600" }}>+ Add Item</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Unit Cost</th>
                  <th>Retail Price</th>
                  <th>Quantity On Hand</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>CPU-RYZ-7950X</td>
                  <td>Ryzen 9 7950X CPU</td>
                  <td>Processors</td>
                  <td>$420.00</td>
                  <td>$549.00</td>
                  <td>2</td>
                </tr>
                <tr>
                  <td>MEM-DDR5-032G</td>
                  <td>DDR5 32GB RAM Kit</td>
                  <td>Memory</td>
                  <td>$85.00</td>
                  <td>$129.00</td>
                  <td>8</td>
                </tr>
                <tr>
                  <td>GPU-RTX-4080S</td>
                  <td>GeForce RTX 4080 Super</td>
                  <td>Graphics Cards</td>
                  <td>$820.00</td>
                  <td>$999.00</td>
                  <td>14</td>
                </tr>
                <tr>
                  <td>SSD-SAMS-002T</td>
                  <td>Samsung 990 Pro 2TB SSD</td>
                  <td>Storage</td>
                  <td>$110.00</td>
                  <td>$169.00</td>
                  <td>32</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "accounting":
        return (
          <div className="section-panel glass-card">
            <div className="section-title">
              <span>Chart of Accounts</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Account Name</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1010</td>
                  <td>Operating Checking Account</td>
                  <td>Asset (Cash)</td>
                  <td>$85,240.00</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>1200</td>
                  <td>Accounts Receivable</td>
                  <td>Asset (Receivables)</td>
                  <td>$14,800.00</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>2000</td>
                  <td>Accounts Payable</td>
                  <td>Liability (Payables)</td>
                  <td>$4,250.00</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>4000</td>
                  <td>Product Sales Revenue</td>
                  <td>Revenue</td>
                  <td>$112,400.00</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
                <tr>
                  <td>5000</td>
                  <td>Cost of Goods Sold (COGS)</td>
                  <td>Expense</td>
                  <td>$68,120.00</td>
                  <td><span className="badge badge-success">Active</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "transactions":
        return (
          <div className="section-panel glass-card">
            <div className="section-title">
              <span>Sales and Purchase Transactions</span>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Ref Number</th>
                  <th>Type</th>
                  <th>Partner</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>SO-2026-102</td>
                  <td>Sales Order</td>
                  <td>Zenith Retailers</td>
                  <td>2026-06-20</td>
                  <td>$8,200.00</td>
                  <td><span className="badge badge-success">Approved</span></td>
                </tr>
                <tr>
                  <td>PO-2026-041</td>
                  <td>Purchase Order</td>
                  <td>Asus Global Ltd</td>
                  <td>2026-06-22</td>
                  <td>$18,400.00</td>
                  <td><span className="badge badge-info">Sent</span></td>
                </tr>
                <tr>
                  <td>SO-2026-103</td>
                  <td>Sales Order</td>
                  <td>Nexus Logistics</td>
                  <td>2026-06-23</td>
                  <td>$12,450.00</td>
                  <td><span className="badge badge-success">Approved</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case "settings":
        return (
          <div className="section-panel glass-card" style={{ maxWidth: "600px" }}>
            <div className="section-title">
              <span>ERP Settings Configuration</span>
            </div>
            <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ background: "#1c1c24", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Tax ID / VAT Registration</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  style={{ background: "#1c1c24", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px", borderRadius: "6px", fontSize: "14px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: "500" }}>Default System Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ background: "#1c1c24", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", padding: "10px", borderRadius: "6px", fontSize: "14px", cursor: "pointer" }}
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>INR (₹)</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => alert("Settings saved locally successfully!")}
                style={{ background: "var(--accent-gradient)", color: "white", padding: "12px", border: "none", borderRadius: "6px", fontWeight: "600", cursor: "pointer", marginTop: "10px" }}
              >
                Save Configurations
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <nav className="sidebar">
        <div className="logo-container">
          <div className="logo-icon">Ω</div>
          <span className="logo-text">localERP</span>
        </div>

        <ul className="nav-links">
          <li>
            <div
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <DashboardIcon />
              <span>Dashboard</span>
            </div>
          </li>
          <li>
            <div
              className={`nav-item ${activeTab === "inventory" ? "active" : ""}`}
              onClick={() => setActiveTab("inventory")}
            >
              <InventoryIcon />
              <span>Inventory</span>
            </div>
          </li>
          <li>
            <div
              className={`nav-item ${activeTab === "accounting" ? "active" : ""}`}
              onClick={() => setActiveTab("accounting")}
            >
              <AccountingIcon />
              <span>Accounting</span>
            </div>
          </li>
          <li>
            <div
              className={`nav-item ${activeTab === "transactions" ? "active" : ""}`}
              onClick={() => setActiveTab("transactions")}
            >
              <TransactionsIcon />
              <span>Transactions</span>
            </div>
          </li>
          <li>
            <div
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <SettingsIcon />
              <span>Settings</span>
            </div>
          </li>
        </ul>

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">System Administrator</span>
          </div>
        </div>
      </nav>

      {/* Main Panel Content */}
      <main className="main-content">
        <header className="content-header">
          <div>
            <h1 className="page-title">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", marginTop: "4px" }}>
              Managing <strong>{companyName}</strong> local workspace.
            </p>
          </div>
          <div className="db-status">
            <span className="status-dot"></span>
            <span>SQLite Connected</span>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}
