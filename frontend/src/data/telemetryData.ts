import { TelemetryEvent, TelemetrySourceInfo } from '../types/telemetry';

export const INITIAL_SOURCES: TelemetrySourceInfo[] = [
  {
    id: 'endpoint',
    name: 'Endpoint Telemetry',
    iconName: 'Monitor',
    status: 'active',
    eventCount: 42,
    latestActivity: '09:09:45',
    examples: ['Device activity', 'Process execution', 'File access', 'Endpoint alerts']
  },
  {
    id: 'network',
    name: 'Network Telemetry',
    iconName: 'Globe',
    status: 'active',
    eventCount: 68,
    latestActivity: '09:09:30',
    examples: ['Source/Dest IP', 'Connection logs', 'DNS queries', 'Suspicious traffic']
  },
  {
    id: 'authentication',
    name: 'Authentication Telemetry',
    iconName: 'Lock',
    status: 'active',
    eventCount: 31,
    latestActivity: '09:08:12',
    examples: ['Login success/failure', 'MFA events', 'Privilege escalation', 'SSO sessions']
  },
  {
    id: 'application',
    name: 'Application Telemetry',
    iconName: 'Cpu',
    status: 'active',
    eventCount: 25,
    latestActivity: '09:08:50',
    examples: ['API activity', 'App access logs', 'Error events', 'Suspicious HTTP requests']
  },
  {
    id: 'file',
    name: 'File / System Telemetry',
    iconName: 'FileText',
    status: 'active',
    eventCount: 18,
    latestActivity: '09:07:21',
    examples: ['Sensitive file access', 'File modification', 'Permission changes', 'Data movement']
  }
];

export const SYNTHETIC_TELEMETRY_DATA: TelemetryEvent[] = [
  // Background Noise 1
  {
    id: 'evt-101',
    timestamp: '09:00:15',
    rawTimestamp: '2026-09-11T09:00:15.102Z',
    source: 'authentication',
    eventType: 'AUTH_SUCCESS',
    title: 'Routine User Login',
    description: 'User administrator authenticated successfully via Azure AD SSO',
    severity: 'info',
    user: 'admin_sarah',
    ip: '10.0.1.15',
    device: 'ADMIN-LAPTOP-01',
    rawData: {
      "evt_id": 4624,
      "sso_provider": "AzureAD",
      "user_principal": "admin_sarah@echo.corp",
      "client_ip": "10.0.1.15",
      "auth_type": "MFA_TOTP",
      "result": "SUCCESS"
    },
    normalizedData: {
      id: 'evt-101',
      timestamp: '09:00:15',
      entity_user: 'admin_sarah',
      entity_ip: '10.0.1.15',
      entity_device: 'ADMIN-LAPTOP-01',
      event_type: 'authentication_success',
      source: 'authentication',
      severity: 'info',
      description: 'Routine admin authentication'
    }
  },

  // Attack Sequence Step 1
  {
    id: 'evt-102',
    timestamp: '09:02:11',
    rawTimestamp: '2026-09-11T09:02:11.841Z',
    source: 'authentication',
    eventType: 'AUTH_FAILURE',
    title: 'Failed User Authentication',
    description: 'Invalid credential submitted for employee_07 from external IP',
    severity: 'medium',
    user: 'employee_07',
    ip: '185.220.101.44',
    device: 'WORKSTATION-07',
    isAttackSequence: true,
    rawData: {
      "login_user": "employee_07",
      "src_ip": "185.220.101.44",
      "target_host": "WORKSTATION-07",
      "auth_service": "PAM_NATIVE",
      "event": "LOGIN_FAILED",
      "reason": "INVALID_PASSWORD"
    },
    normalizedData: {
      id: 'evt-102',
      timestamp: '09:02:11',
      entity_user: 'employee_07',
      entity_ip: '185.220.101.44',
      entity_device: 'WORKSTATION-07',
      event_type: 'authentication_failure',
      source: 'authentication',
      severity: 'medium',
      description: 'Failed login attempt for employee_07'
    }
  },

  // Background Noise 2
  {
    id: 'evt-103',
    timestamp: '09:02:30',
    rawTimestamp: '2026-09-11T09:02:30.220Z',
    source: 'application',
    eventType: 'API_REQUEST',
    title: 'Internal API Gateway Call',
    description: 'GET /api/v1/healthcheck from monitoring worker node',
    severity: 'info',
    user: 'svc_monitor',
    ip: '10.0.4.50',
    device: 'CLUSTER-NODE-02',
    rawData: {
      "http_method": "GET",
      "uri_path": "/api/v1/healthcheck",
      "status_code": 200,
      "user_agent": "ECHO-HealthAgent/2.1",
      "caller": "svc_monitor"
    },
    normalizedData: {
      id: 'evt-103',
      timestamp: '09:02:30',
      entity_user: 'svc_monitor',
      entity_ip: '10.0.4.50',
      entity_device: 'CLUSTER-NODE-02',
      event_type: 'api_access',
      source: 'application',
      severity: 'info',
      description: 'Routine API health check'
    }
  },

  // Attack Sequence Step 2
  {
    id: 'evt-104',
    timestamp: '09:02:48',
    rawTimestamp: '2026-09-11T09:02:48.112Z',
    source: 'authentication',
    eventType: 'AUTH_SUCCESS',
    title: 'Successful User Authentication',
    description: 'Authentication succeeded for employee_07 after previous failure',
    severity: 'low',
    user: 'employee_07',
    ip: '185.220.101.44',
    device: 'WORKSTATION-07',
    isAttackSequence: true,
    rawData: {
      "login_user": "employee_07",
      "src_ip": "185.220.101.44",
      "target_host": "WORKSTATION-07",
      "auth_service": "PAM_NATIVE",
      "event": "LOGIN_SUCCESS",
      "session_id": "SESS-90812"
    },
    normalizedData: {
      id: 'evt-104',
      timestamp: '09:02:48',
      entity_user: 'employee_07',
      entity_ip: '185.220.101.44',
      entity_device: 'WORKSTATION-07',
      event_type: 'authentication_success',
      source: 'authentication',
      severity: 'low',
      description: 'Successful authentication for employee_07'
    }
  },

  // Background Noise 3
  {
    id: 'evt-105',
    timestamp: '09:03:15',
    rawTimestamp: '2026-09-11T09:03:15.901Z',
    source: 'endpoint',
    eventType: 'PROCESS_START',
    title: 'Standard Application Launch',
    description: 'Process msedge.exe started by employee_12',
    severity: 'info',
    user: 'employee_12',
    device: 'WORKSTATION-12',
    rawData: {
      "process_name": "msedge.exe",
      "parent_process": "explorer.exe",
      "pid": 4812,
      "command_line": "\"C:\\Program Files\\Microsoft\\Edge\\msedge.exe\"",
      "account": "employee_12"
    },
    normalizedData: {
      id: 'evt-105',
      timestamp: '09:03:15',
      entity_user: 'employee_12',
      entity_device: 'WORKSTATION-12',
      event_type: 'process_execution',
      source: 'endpoint',
      severity: 'info',
      description: 'Browser launch process'
    }
  },

  // Attack Sequence Step 3
  {
    id: 'evt-106',
    timestamp: '09:04:16',
    rawTimestamp: '2026-09-11T09:04:16.550Z',
    source: 'endpoint',
    eventType: 'SUSPICIOUS_PROCESS',
    title: 'Suspicious Execution Detected',
    description: 'Encoded PowerShell script execution with bypass flags on WORKSTATION-07',
    severity: 'high',
    user: 'employee_07',
    device: 'WORKSTATION-07',
    isAttackSequence: true,
    rawData: {
      "proc_path": "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      "cli_args": "powershell.exe -ExecutionPolicy Bypass -enc SQBFAFgAKABOAGUAdwAtAE8AYgBqAGUAYwB0ACAA...",
      "proc_owner": "employee_07",
      "host_id": "WORKSTATION-07",
      "edr_alert_id": "EDR-88219"
    },
    normalizedData: {
      id: 'evt-106',
      timestamp: '09:04:16',
      entity_user: 'employee_07',
      entity_device: 'WORKSTATION-07',
      event_type: 'process_execution_suspicious',
      source: 'endpoint',
      severity: 'high',
      description: 'Encoded PowerShell execution bypassing policy'
    }
  },

  // Background Noise 4
  {
    id: 'evt-107',
    timestamp: '09:05:00',
    rawTimestamp: '2026-09-11T09:05:00.010Z',
    source: 'network',
    eventType: 'DNS_QUERY',
    title: 'Routine Domain Resolution',
    description: 'DNS Query for api.github.com resolved to 140.82.121.4',
    severity: 'info',
    user: 'developer_devin',
    ip: '10.0.2.88',
    device: 'DEV-RIG-04',
    rawData: {
      "dns_query": "api.github.com",
      "qtype": "A",
      "resolved_ip": "140.82.121.4",
      "src_ip": "10.0.2.88",
      "proto": "UDP"
    },
    normalizedData: {
      id: 'evt-107',
      timestamp: '09:05:00',
      entity_user: 'developer_devin',
      entity_ip: '10.0.2.88',
      entity_device: 'DEV-RIG-04',
      event_type: 'dns_lookup',
      source: 'network',
      severity: 'info',
      description: 'Routine DNS query for developer platform'
    }
  },

  // Attack Sequence Step 4
  {
    id: 'evt-108',
    timestamp: '09:06:03',
    rawTimestamp: '2026-09-11T09:06:03.310Z',
    source: 'network',
    eventType: 'OUTBOUND_CONN',
    title: 'Unusual Outbound Network Connection',
    description: 'Outbound TCP connection from WORKSTATION-07 to unranked external IP 45.33.32.156',
    severity: 'high',
    ip: '45.33.32.156',
    device: 'WORKSTATION-07',
    destination: '45.33.32.156:443',
    isAttackSequence: true,
    rawData: {
      "src_host": "WORKSTATION-07",
      "src_ip": "10.0.3.107",
      "dst_ip": "45.33.32.156",
      "dst_port": 443,
      "bytes_sent": 14200,
      "reputation_score": 12,
      "threat_category": "SUSPICIOUS_C2"
    },
    normalizedData: {
      id: 'evt-108',
      timestamp: '09:06:03',
      entity_ip: '45.33.32.156',
      entity_device: 'WORKSTATION-07',
      event_type: 'network_connection_outbound',
      source: 'network',
      severity: 'high',
      description: 'Suspicious outbound connection to remote endpoint'
    }
  },

  // Attack Sequence Step 5
  {
    id: 'evt-109',
    timestamp: '09:07:21',
    rawTimestamp: '2026-09-11T09:07:21.018Z',
    source: 'file',
    eventType: 'FILE_ACCESS',
    title: 'Sensitive Asset Access',
    description: 'Sensitive spreadsheet finance_records.xlsx opened by employee_07',
    severity: 'medium',
    user: 'employee_07',
    device: 'WORKSTATION-07',
    asset: 'finance_records.xlsx',
    isAttackSequence: true,
    rawData: {
      "file_path": "\\\\CORP-NAS01\\Finance\\Restricted\\finance_records.xlsx",
      "access_mask": "0x0002 (FILE_WRITE_DATA)",
      "accessor_user": "employee_07",
      "workstation": "WORKSTATION-07",
      "sensitivity_classification": "RESTRICTED_CONFIDENTIAL"
    },
    normalizedData: {
      id: 'evt-109',
      timestamp: '09:07:21',
      entity_user: 'employee_07',
      entity_device: 'WORKSTATION-07',
      entity_asset: 'finance_records.xlsx',
      event_type: 'file_access_sensitive',
      source: 'file',
      severity: 'medium',
      description: 'Access to classified financial asset'
    }
  },

  // Attack Sequence Step 6
  {
    id: 'evt-110',
    timestamp: '09:09:10',
    rawTimestamp: '2026-09-11T09:09:10.772Z',
    source: 'network',
    eventType: 'DATA_EXFILTRATION_ALERT',
    title: 'Large Data Transfer Attempt',
    description: 'High volume egress traffic (148 MB) detected from WORKSTATION-07 to 45.33.32.156',
    severity: 'critical',
    user: 'employee_07',
    ip: '45.33.32.156',
    device: 'WORKSTATION-07',
    asset: 'finance_records.xlsx',
    destination: '45.33.32.156:443',
    isAttackSequence: true,
    rawData: {
      "src_device": "WORKSTATION-07",
      "src_user": "employee_07",
      "dst_external_ip": "45.33.32.156",
      "total_bytes_transferred": 155189200,
      "transfer_duration_sec": 42,
      "protocol": "HTTPS_ENCRYPTED",
      "alert_rule": "POTENTIAL_DATA_EXFILTRATION"
    },
    normalizedData: {
      id: 'evt-110',
      timestamp: '09:09:10',
      entity_user: 'employee_07',
      entity_ip: '45.33.32.156',
      entity_device: 'WORKSTATION-07',
      entity_asset: 'finance_records.xlsx',
      event_type: 'data_exfiltration_attempt',
      source: 'network',
      severity: 'critical',
      description: 'Egress burst exceeding policy threshold'
    }
  }
];
