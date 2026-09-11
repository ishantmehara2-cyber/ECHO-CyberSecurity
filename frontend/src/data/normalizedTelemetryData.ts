export interface NormalizedTelemetryRecord {
  id: string;
  time: string;
  source: 'authentication' | 'network' | 'endpoint' | 'application' | 'file';
  user: string;
  host: string;
  ip: string;
  eventType: string;
  status: 'Normal' | 'Observed' | 'Requires correlation' | 'Potentially suspicious';
  description: string;
}

export const REPRESENTATIVE_100_EVENTS: NormalizedTelemetryRecord[] = [
  // 1-10
  { id: 'rec-001', time: '08:00:12', source: 'authentication', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Logon Success', status: 'Normal', description: 'SSO logon via Azure AD' },
  { id: 'rec-002', time: '08:02:45', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'outlook.exe started' },
  { id: 'rec-003', time: '08:05:10', source: 'network', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'DNS Query', status: 'Normal', description: 'outlook.office365.com' },
  { id: 'rec-004', time: '08:12:00', source: 'authentication', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'Logon Success', status: 'Normal', description: 'Domain controller PAM logon' },
  { id: 'rec-005', time: '08:14:20', source: 'endpoint', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'Process Start', status: 'Normal', description: 'msedge.exe started' },
  { id: 'rec-006', time: '08:15:30', source: 'network', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'HTTP GET', status: 'Normal', description: 'internal-wiki.corp' },
  { id: 'rec-007', time: '08:20:00', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-01', ip: '10.0.4.50', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/metrics' },
  { id: 'rec-008', time: '08:25:11', source: 'authentication', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Logon Success', status: 'Normal', description: 'SSH key logon' },
  { id: 'rec-009', time: '08:27:00', source: 'endpoint', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Process Start', status: 'Normal', description: 'code.exe started' },
  { id: 'rec-010', time: '08:30:15', source: 'file', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'File Read', status: 'Normal', description: 'package.json accessed' },

  // 11-20
  { id: 'rec-011', time: '08:35:40', source: 'network', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'HTTPS Outbound', status: 'Normal', description: 'github.com:443' },
  { id: 'rec-012', time: '08:40:02', source: 'authentication', user: 'employee_12', host: 'WORKSTATION-12', ip: '10.0.2.112', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-013', time: '08:42:19', source: 'endpoint', user: 'employee_12', host: 'WORKSTATION-12', ip: '10.0.2.112', eventType: 'Process Start', status: 'Normal', description: 'excel.exe started' },
  { id: 'rec-014', time: '08:45:00', source: 'file', user: 'employee_12', host: 'WORKSTATION-12', ip: '10.0.2.112', eventType: 'File Read', status: 'Normal', description: 'q3_budget.xlsx' },
  { id: 'rec-015', time: '08:50:22', source: 'application', user: 'svc_backup', host: 'NAS-SERVER-01', ip: '10.0.5.10', eventType: 'Sync Task', status: 'Observed', description: 'Scheduled NAS incremental backup' },
  { id: 'rec-016', time: '08:55:00', source: 'network', user: 'svc_backup', host: 'NAS-SERVER-01', ip: '10.0.5.10', eventType: 'SMB Transfer', status: 'Observed', description: 'Internal SMB data sync' },
  { id: 'rec-017', time: '09:00:10', source: 'authentication', user: 'finance_view', host: 'FINANCE-SRV', ip: '10.0.3.20', eventType: 'Logon Success', status: 'Normal', description: 'Service account logon' },
  { id: 'rec-018', time: '09:02:45', source: 'application', user: 'finance_view', host: 'FINANCE-SRV', ip: '10.0.3.20', eventType: 'SQL Query', status: 'Normal', description: 'SELECT * FROM ledger' },
  { id: 'rec-019', time: '09:05:00', source: 'network', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'HTTPS Outbound', status: 'Normal', description: 'google.com:443' },
  { id: 'rec-020', time: '09:10:14', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'mmc.exe started' },

  // 21-30
  { id: 'rec-021', time: '09:15:30', source: 'authentication', user: 'employee_05', host: 'WORKSTATION-05', ip: '10.0.2.55', eventType: 'Logon Failure', status: 'Requires correlation', description: 'Password error' },
  { id: 'rec-022', time: '09:15:45', source: 'authentication', user: 'employee_05', host: 'WORKSTATION-05', ip: '10.0.2.55', eventType: 'Logon Success', status: 'Normal', description: 'Logon success on 2nd attempt' },
  { id: 'rec-023', time: '09:18:00', source: 'endpoint', user: 'employee_05', host: 'WORKSTATION-05', ip: '10.0.2.55', eventType: 'Process Start', status: 'Normal', description: 'teams.exe started' },
  { id: 'rec-024', time: '09:22:10', source: 'network', user: 'employee_05', host: 'WORKSTATION-05', ip: '10.0.2.55', eventType: 'DNS Query', status: 'Normal', description: 'teams.microsoft.com' },
  { id: 'rec-025', time: '09:28:00', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-02', ip: '10.0.4.51', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/health' },
  { id: 'rec-026', time: '09:32:15', source: 'file', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'File Read', status: 'Normal', description: 'team_meeting.docx' },
  { id: 'rec-027', time: '09:38:00', source: 'authentication', user: 'hr_manager', host: 'HR-LAPTOP-02', ip: '10.0.1.80', eventType: 'Logon Success', status: 'Normal', description: 'MFA TOTP logon' },
  { id: 'rec-028', time: '09:42:10', source: 'file', user: 'hr_manager', host: 'HR-LAPTOP-02', ip: '10.0.1.80', eventType: 'File Read', status: 'Normal', description: 'policies_2026.pdf' },
  { id: 'rec-029', time: '09:48:30', source: 'network', user: 'hr_manager', host: 'HR-LAPTOP-02', ip: '10.0.1.80', eventType: 'HTTPS Outbound', status: 'Normal', description: 'workday.com:443' },
  { id: 'rec-030', time: '09:55:00', source: 'endpoint', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Process Start', status: 'Normal', description: 'git.exe started' },

  // 31-40
  { id: 'rec-031', time: '10:02:10', source: 'network', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'SSH Connection', status: 'Normal', description: 'git-server.internal:22' },
  { id: 'rec-032', time: '10:08:45', source: 'authentication', user: 'employee_15', host: 'WORKSTATION-15', ip: '10.0.2.115', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-033', time: '10:12:00', source: 'endpoint', user: 'employee_15', host: 'WORKSTATION-15', ip: '10.0.2.115', eventType: 'Process Start', status: 'Normal', description: 'chrome.exe started' },
  { id: 'rec-034', time: '10:18:22', source: 'application', user: 'svc_print', host: 'PRINT-SERVER', ip: '10.0.5.20', eventType: 'Print Job', status: 'Observed', description: 'Spooler job processed' },
  { id: 'rec-035', time: '10:22:00', source: 'file', user: 'employee_15', host: 'WORKSTATION-15', ip: '10.0.2.115', eventType: 'File Write', status: 'Normal', description: 'temp_notes.txt' },

  // Suspicious Sequence Injected Amongst 100
  { id: 'rec-036', time: '10:28:43', source: 'authentication', user: 'employee_07', host: 'WORKSTATION-07', ip: '185.220.101.45', eventType: 'Logon Failure', status: 'Requires correlation', description: 'Failed password attempt from external Tor exit node' },
  { id: 'rec-037', time: '10:29:08', source: 'authentication', user: 'employee_07', host: 'WORKSTATION-07', ip: '185.220.101.45', eventType: 'Logon Failure', status: 'Requires correlation', description: 'Second failed attempt from external Tor IP' },
  { id: 'rec-038', time: '10:29:41', source: 'authentication', user: 'employee_07', host: 'WORKSTATION-07', ip: '185.220.101.45', eventType: 'Logon Failure', status: 'Requires correlation', description: 'Third failed attempt from external Tor IP' },
  { id: 'rec-039', time: '10:30:16', source: 'authentication', user: 'employee_07', host: 'WORKSTATION-07', ip: '185.220.101.45', eventType: 'Logon Success', status: 'Potentially suspicious', description: 'Logon success from Tor exit IP; token SES-7F21A issued' },
  { id: 'rec-040', time: '10:30:42', source: 'endpoint', user: 'employee_07', host: 'WORKSTATION-07', ip: '10.0.3.107', eventType: 'Process Start', status: 'Potentially suspicious', description: 'powershell.exe -ExecutionPolicy Bypass -enc' },

  // 41-50
  { id: 'rec-041', time: '10:31:10', source: 'network', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'DNS Query', status: 'Normal', description: 'bing.com' },
  { id: 'rec-042', time: '10:32:28', source: 'file', user: 'employee_07', host: 'WORKSTATION-07', ip: '10.0.3.107', eventType: 'File Read', status: 'Potentially suspicious', description: 'finance_records.xlsx read by powershell.exe' },
  { id: 'rec-043', time: '10:33:00', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-01', ip: '10.0.4.50', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/status' },
  { id: 'rec-044', time: '10:34:09', source: 'endpoint', user: 'employee_07', host: 'WORKSTATION-07', ip: '10.0.3.107', eventType: 'File Write', status: 'Potentially suspicious', description: 'review_package.zip created in AppData\\Temp' },
  { id: 'rec-045', time: '10:35:12', source: 'network', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'HTTPS Outbound', status: 'Normal', description: 'npmjs.org:443' },
  { id: 'rec-046', time: '10:36:19', source: 'network', user: 'employee_07', host: 'WORKSTATION-07', ip: '198.51.100.77', eventType: 'HTTPS Egress', status: 'Potentially suspicious', description: '148MB data egress to sync-archive.example.test' },
  { id: 'rec-047', time: '10:40:00', source: 'authentication', user: 'employee_20', host: 'WORKSTATION-20', ip: '10.0.2.120', eventType: 'Logon Success', status: 'Normal', description: 'Domain PAM logon' },
  { id: 'rec-048', time: '10:42:30', source: 'endpoint', user: 'employee_20', host: 'WORKSTATION-20', ip: '10.0.2.120', eventType: 'Process Start', status: 'Normal', description: 'winword.exe started' },
  { id: 'rec-049', time: '10:45:10', source: 'file', user: 'employee_20', host: 'WORKSTATION-20', ip: '10.0.2.120', eventType: 'File Read', status: 'Normal', description: 'report_draft.docx' },
  { id: 'rec-050', time: '10:50:00', source: 'network', user: 'employee_20', host: 'WORKSTATION-20', ip: '10.0.2.120', eventType: 'HTTPS Outbound', status: 'Normal', description: 'sharepoint.com:443' },

  // 51-60
  { id: 'rec-051', time: '10:55:12', source: 'application', user: 'svc_auth', host: 'AUTH-GATEWAY-01', ip: '10.0.1.10', eventType: 'Session Purge', status: 'Observed', description: 'Expired SSO tokens purged' },
  { id: 'rec-052', time: '11:00:00', source: 'authentication', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Logon Success', status: 'Normal', description: 'PAM re-auth' },
  { id: 'rec-053', time: '11:05:40', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'cmd.exe started' },
  { id: 'rec-054', time: '11:10:00', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'ping.exe 10.0.1.1' },
  { id: 'rec-055', time: '11:15:20', source: 'network', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'ICMP Echo', status: 'Normal', description: 'Internal ping request' },
  { id: 'rec-056', time: '11:20:00', source: 'file', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'File Write', status: 'Normal', description: 'notes.txt saved' },
  { id: 'rec-057', time: '11:25:10', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-01', ip: '10.0.4.50', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/metrics' },
  { id: 'rec-058', time: '11:30:00', source: 'authentication', user: 'employee_25', host: 'WORKSTATION-25', ip: '10.0.2.125', eventType: 'Logon Success', status: 'Normal', description: 'Domain PAM logon' },
  { id: 'rec-059', time: '11:35:15', source: 'endpoint', user: 'employee_25', host: 'WORKSTATION-25', ip: '10.0.2.125', eventType: 'Process Start', status: 'Normal', description: 'slack.exe started' },
  { id: 'rec-060', time: '11:40:00', source: 'network', user: 'employee_25', host: 'WORKSTATION-25', ip: '10.0.2.125', eventType: 'HTTPS Outbound', status: 'Normal', description: 'slack.com:443' },

  // 61-70
  { id: 'rec-061', time: '11:45:30', source: 'file', user: 'employee_25', host: 'WORKSTATION-25', ip: '10.0.2.125', eventType: 'File Read', status: 'Normal', description: 'project_roadmap.pdf' },
  { id: 'rec-062', time: '11:50:00', source: 'application', user: 'svc_mail', host: 'MAIL-GATEWAY', ip: '10.0.5.30', eventType: 'SMTP Egress', status: 'Observed', description: 'Outbound mail relay' },
  { id: 'rec-063', time: '11:55:10', source: 'authentication', user: 'employee_30', host: 'WORKSTATION-30', ip: '10.0.2.130', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-064', time: '12:00:00', source: 'endpoint', user: 'employee_30', host: 'WORKSTATION-30', ip: '10.0.2.130', eventType: 'Process Start', status: 'Normal', description: 'calc.exe started' },
  { id: 'rec-065', time: '12:05:22', source: 'network', user: 'employee_30', host: 'WORKSTATION-30', ip: '10.0.2.130', eventType: 'DNS Query', status: 'Normal', description: 'weather.com' },
  { id: 'rec-066', time: '12:10:00', source: 'file', user: 'employee_30', host: 'WORKSTATION-30', ip: '10.0.2.130', eventType: 'File Read', status: 'Normal', description: 'lunch_menu.pdf' },
  { id: 'rec-067', time: '12:15:45', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-02', ip: '10.0.4.51', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/health' },
  { id: 'rec-068', time: '12:20:00', source: 'authentication', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Logon Success', status: 'Normal', description: 'SSH re-auth' },
  { id: 'rec-069', time: '12:25:30', source: 'endpoint', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Process Start', status: 'Normal', description: 'docker.exe started' },
  { id: 'rec-070', time: '12:30:00', source: 'network', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'HTTPS Outbound', status: 'Normal', description: 'docker.io:443' },

  // 71-80
  { id: 'rec-071', time: '12:35:10', source: 'file', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'File Write', status: 'Normal', description: 'Dockerfile created' },
  { id: 'rec-072', time: '12:40:00', source: 'authentication', user: 'employee_35', host: 'WORKSTATION-35', ip: '10.0.2.135', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-073', time: '12:45:20', source: 'endpoint', user: 'employee_35', host: 'WORKSTATION-35', ip: '10.0.2.135', eventType: 'Process Start', status: 'Normal', description: 'notepad.exe started' },
  { id: 'rec-074', time: '12:50:00', source: 'network', user: 'employee_35', host: 'WORKSTATION-35', ip: '10.0.2.135', eventType: 'DNS Query', status: 'Normal', description: 'wikipedia.org' },
  { id: 'rec-075', time: '12:55:00', source: 'file', user: 'employee_35', host: 'WORKSTATION-35', ip: '10.0.2.135', eventType: 'File Write', status: 'Normal', description: 'todo.txt' },
  { id: 'rec-076', time: '13:00:15', source: 'application', user: 'svc_backup', host: 'NAS-SERVER-01', ip: '10.0.5.10', eventType: 'Sync Task', status: 'Observed', description: 'Midday NAS snapshot' },
  { id: 'rec-077', time: '13:05:00', source: 'authentication', user: 'employee_40', host: 'WORKSTATION-40', ip: '10.0.2.140', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-078', time: '13:10:30', source: 'endpoint', user: 'employee_40', host: 'WORKSTATION-40', ip: '10.0.2.140', eventType: 'Process Start', status: 'Normal', description: 'powerpnt.exe started' },
  { id: 'rec-079', time: '13:15:00', source: 'file', user: 'employee_40', host: 'WORKSTATION-40', ip: '10.0.2.140', eventType: 'File Read', status: 'Normal', description: 'all_hands.pptx' },
  { id: 'rec-080', time: '13:20:10', source: 'network', user: 'employee_40', host: 'WORKSTATION-40', ip: '10.0.2.140', eventType: 'HTTPS Outbound', status: 'Normal', description: 'onedrive.com:443' },

  // 81-90
  { id: 'rec-081', time: '13:25:00', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-01', ip: '10.0.4.50', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/metrics' },
  { id: 'rec-082', time: '13:30:40', source: 'authentication', user: 'employee_45', host: 'WORKSTATION-45', ip: '10.0.2.145', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-083', time: '13:35:00', source: 'endpoint', user: 'employee_45', host: 'WORKSTATION-45', ip: '10.0.2.145', eventType: 'Process Start', status: 'Normal', description: 'vlc.exe started' },
  { id: 'rec-084', time: '13:40:15', source: 'network', user: 'employee_45', host: 'WORKSTATION-45', ip: '10.0.2.145', eventType: 'DNS Query', status: 'Normal', description: 'youtube.com' },
  { id: 'rec-085', time: '13:45:00', source: 'file', user: 'employee_45', host: 'WORKSTATION-45', ip: '10.0.2.145', eventType: 'File Read', status: 'Normal', description: 'training_video.mp4' },
  { id: 'rec-086', time: '13:50:20', source: 'authentication', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Logon Success', status: 'Normal', description: 'MFA TOTP logon' },
  { id: 'rec-087', time: '13:55:00', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'powershell.exe' },
  { id: 'rec-088', time: '14:00:10', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Start', status: 'Normal', description: 'Get-Service' },
  { id: 'rec-089', time: '14:05:00', source: 'network', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'HTTPS Outbound', status: 'Normal', description: 'portal.azure.com:443' },
  { id: 'rec-090', time: '14:10:30', source: 'application', user: 'svc_auth', host: 'AUTH-GATEWAY-01', ip: '10.0.1.10', eventType: 'Key Rotation', status: 'Observed', description: 'Routine token signing key rotation' },

  // 91-100
  { id: 'rec-091', time: '14:15:00', source: 'authentication', user: 'employee_50', host: 'WORKSTATION-50', ip: '10.0.2.150', eventType: 'Logon Success', status: 'Normal', description: 'PAM logon' },
  { id: 'rec-092', time: '14:20:40', source: 'endpoint', user: 'employee_50', host: 'WORKSTATION-50', ip: '10.0.2.150', eventType: 'Process Start', status: 'Normal', description: 'acrobat.exe started' },
  { id: 'rec-093', time: '14:25:00', source: 'file', user: 'employee_50', host: 'WORKSTATION-50', ip: '10.0.2.150', eventType: 'File Read', status: 'Normal', description: 'annual_report.pdf' },
  { id: 'rec-094', time: '14:30:15', source: 'network', user: 'employee_50', host: 'WORKSTATION-50', ip: '10.0.2.150', eventType: 'HTTPS Outbound', status: 'Normal', description: 'adobe.com:443' },
  { id: 'rec-095', time: '14:35:00', source: 'application', user: 'svc_monitor', host: 'CLUSTER-NODE-02', ip: '10.0.4.51', eventType: 'API Call', status: 'Normal', description: 'GET /api/v1/metrics' },
  { id: 'rec-096', time: '14:40:22', source: 'authentication', user: 'employee_02', host: 'WORKSTATION-02', ip: '10.0.2.22', eventType: 'Logoff Success', status: 'Normal', description: 'Session ended cleanly' },
  { id: 'rec-097', time: '14:45:00', source: 'authentication', user: 'developer_devin', host: 'DEV-RIG-04', ip: '10.0.2.88', eventType: 'Logoff Success', status: 'Normal', description: 'SSH session closed' },
  { id: 'rec-098', time: '14:50:10', source: 'endpoint', user: 'admin_sarah', host: 'ADMIN-LAPTOP-01', ip: '10.0.1.15', eventType: 'Process Stop', status: 'Normal', description: 'mmc.exe terminated' },
  { id: 'rec-099', time: '14:55:00', source: 'application', user: 'svc_backup', host: 'NAS-SERVER-01', ip: '10.0.5.10', eventType: 'Sync Task', status: 'Observed', description: 'Daily backup completion' },
  { id: 'rec-100', time: '15:00:00', source: 'network', user: 'system', host: 'GATEWAY-01', ip: '10.0.0.1', eventType: 'Health Probe', status: 'Normal', description: 'Core router interface heartbeat' }
];
