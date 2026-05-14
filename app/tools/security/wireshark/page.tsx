"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity, Search, Filter, Download, Eye, Server, Globe,
  ArrowRight, ChevronRight, BookOpen, Terminal, Network,
  Wifi, ChevronDown, BarChart3, FileText, HelpCircle, X
} from "lucide-react";

type Protocol = "DNS" | "TCP" | "HTTP" | "TLS";

interface AppLayer {
  method?: string;
  uri?: string;
  status?: string;
  contentType?: string;
  query?: string;
  answer?: string;
  version?: string;
  sni?: string;
}

interface Packet {
  no: number;
  time: string;
  src: string;
  dst: string;
  protocol: Protocol;
  length: number;
  info: string;
  dstMac: string;
  srcMac: string;
  ipSrc: string;
  ipDst: string;
  ttl: number;
  ipProtocol: string;
  srcPort: number;
  dstPort: number;
  seq: string;
  ack: string;
  flags: string[];
  app?: AppLayer;
  rawBytes: number[];
}

const FORMATTED_DNS_QUERY = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x3a, 0x36, 0x97, 0x00, 0x00, 0x40, 0x11, 0xa5, 0x37, 0xc0, 0xa8, 0x01, 0x64, 0x08, 0x08,
  0x08, 0x08, 0xe8, 0x02, 0x00, 0x35, 0x00, 0x26, 0x00, 0x00, 0x01, 0x23, 0x01, 0x00, 0x00, 0x01,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x07, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x03, 0x63,
  0x6f, 0x6d, 0x00, 0x00, 0x01, 0x00, 0x01,
];

const FORMATTED_DNS_RESPONSE = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0xa6, 0x36, 0x98, 0x00, 0x00, 0x40, 0x11, 0xa4, 0xc1, 0x08, 0x08, 0x08, 0x08, 0xc0, 0xa8,
  0x01, 0x64, 0x00, 0x35, 0xe8, 0x02, 0x00, 0x92, 0x00, 0x00, 0x01, 0x23, 0x01, 0x00, 0x00, 0x01,
  0x00, 0x01, 0x00, 0x00, 0x00, 0x00, 0x07, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x03, 0x63,
  0x6f, 0x6d, 0x00, 0x00, 0x01, 0x00, 0x01, 0xc0, 0x0c, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x00,
  0x3c, 0x00, 0x04, 0x5d, 0xb8, 0xd8, 0x22,
];

const FORMATTED_TCP_SYN = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x34, 0x36, 0x99, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x33, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x50, 0x02,
  0xfa, 0xf0, 0xe6, 0x32, 0x00, 0x00, 0x02, 0x04, 0x05, 0xb4, 0x04, 0x02, 0x08, 0x0a, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x03, 0x03, 0x06,
];

const FORMATTED_TCP_SYNACK = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x34, 0x00, 0x00, 0x40, 0x00, 0x40, 0x06, 0x9c, 0xcc, 0x5d, 0xb8, 0xd8, 0x22, 0xc0, 0xa8,
  0x01, 0x64, 0x00, 0x50, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x50, 0x12,
  0xfa, 0xf0, 0x93, 0xf1, 0x00, 0x00, 0x02, 0x04, 0x05, 0xb4, 0x04, 0x02, 0x08, 0x0a, 0x01, 0x23,
  0x45, 0x67, 0x00, 0x00, 0x00, 0x00, 0x01, 0x03, 0x03, 0x05,
];

const FORMATTED_TCP_ACK = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x36, 0x9a, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x39, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x50, 0x10,
  0xfa, 0xf0, 0xe5, 0xd0, 0x00, 0x00,
];

const FORMATTED_HTTP_GET = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x86, 0x36, 0x9b, 0x40, 0x00, 0x40, 0x06, 0xa4, 0xe9, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x50, 0x18,
  0xfa, 0xf0, 0xe5, 0x7a, 0x00, 0x00, 0x47, 0x45, 0x54, 0x20, 0x2f, 0x69, 0x6e, 0x64, 0x65, 0x78,
  0x2e, 0x68, 0x74, 0x6d, 0x6c, 0x20, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31, 0x2e, 0x31, 0x0d, 0x0a,
  0x48, 0x6f, 0x73, 0x74, 0x3a, 0x20, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x63, 0x6f,
  0x6d, 0x0d, 0x0a, 0x55, 0x73, 0x65, 0x72, 0x2d, 0x41, 0x67, 0x65, 0x6e, 0x74, 0x3a, 0x20, 0x4d,
  0x6f, 0x7a, 0x69, 0x6c, 0x6c, 0x61, 0x2f, 0x35, 0x2e, 0x30, 0x0d, 0x0a, 0x0d, 0x0a,
];

const FORMATTED_HTTP_RESPONSE = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x08, 0x00, 0x45, 0x00,
  0x02, 0x06, 0xab, 0xcd, 0x40, 0x00, 0x40, 0x06, 0x9a, 0x8f, 0x5d, 0xb8, 0xd8, 0x22, 0xc0, 0xa8,
  0x01, 0x64, 0x00, 0x50, 0xc0, 0x00, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x8c, 0x50, 0x18,
  0xfa, 0xf0, 0x98, 0x7c, 0x00, 0x00, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31, 0x2e, 0x31, 0x20, 0x32,
  0x30, 0x30, 0x20, 0x4f, 0x4b, 0x0d, 0x0a, 0x43, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x2d, 0x54,
  0x79, 0x70, 0x65, 0x3a, 0x20, 0x74, 0x65, 0x78, 0x74, 0x2f, 0x68, 0x74, 0x6d, 0x6c, 0x0d, 0x0a,
  0x43, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x2d, 0x4c, 0x65, 0x6e, 0x67, 0x74, 0x68, 0x3a, 0x20,
  0x33, 0x34, 0x35, 0x0d, 0x0a, 0x0d, 0x0a, 0x3c, 0x21, 0x44, 0x4f, 0x43, 0x54, 0x59, 0x50, 0x45,
  0x20, 0x68, 0x74, 0x6d, 0x6c, 0x3e, 0x0a, 0x3c, 0x68, 0x74, 0x6d, 0x6c, 0x3e, 0x0a, 0x3c, 0x68,
  0x65, 0x61, 0x64, 0x3e, 0x3c, 0x74, 0x69, 0x74, 0x6c, 0x65, 0x3e, 0x45, 0x78, 0x61, 0x6d, 0x70,
  0x6c, 0x65, 0x3c, 0x2f, 0x74, 0x69, 0x74, 0x6c, 0x65, 0x3e, 0x3c, 0x2f, 0x68, 0x65, 0x61, 0x64,
  0x3e, 0x0a, 0x3c, 0x62, 0x6f, 0x64, 0x79, 0x3e, 0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x20, 0x57, 0x6f,
  0x72, 0x6c, 0x64, 0x3c, 0x2f, 0x62, 0x6f, 0x64, 0x79, 0x3e, 0x0a, 0x3c, 0x2f, 0x68, 0x74, 0x6d,
  0x6c, 0x3e, 0x0a,
];

const FORMATTED_HTTP_GET_IMAGE = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x8a, 0x36, 0x9c, 0x40, 0x00, 0x40, 0x06, 0xa4, 0xe5, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x8d, 0x00, 0x00, 0x01, 0xd3, 0x50, 0x18,
  0xfa, 0xf0, 0xe4, 0xf6, 0x00, 0x00, 0x47, 0x45, 0x54, 0x20, 0x2f, 0x6c, 0x6f, 0x67, 0x6f, 0x2e,
  0x70, 0x6e, 0x67, 0x20, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31, 0x2e, 0x31, 0x0d, 0x0a, 0x48, 0x6f,
  0x73, 0x74, 0x3a, 0x20, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x63, 0x6f, 0x6d, 0x0d,
  0x0a, 0x52, 0x65, 0x66, 0x65, 0x72, 0x65, 0x72, 0x3a, 0x20, 0x68, 0x74, 0x74, 0x70, 0x3a, 0x2f,
  0x2f, 0x65, 0x78, 0x61, 0x6d, 0x70, 0x6c, 0x65, 0x2e, 0x63, 0x6f, 0x6d, 0x2f, 0x0d, 0x0a, 0x0d,
  0x0a,
];

const FORMATTED_HTTP_RESPONSE_IMAGE = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x08, 0x00, 0x45, 0x00,
  0x04, 0xc8, 0xab, 0xce, 0x40, 0x00, 0x40, 0x06, 0x97, 0xcd, 0x5d, 0xb8, 0xd8, 0x22, 0xc0, 0xa8,
  0x01, 0x64, 0x00, 0x50, 0xc0, 0x00, 0x00, 0x01, 0xd3, 0x00, 0x00, 0x00, 0x8e, 0x50, 0x18, 0xfa,
  0xf0, 0x97, 0x06, 0x00, 0x00, 0x48, 0x54, 0x54, 0x50, 0x2f, 0x31, 0x2e, 0x31, 0x20, 0x32, 0x30,
  0x30, 0x20, 0x4f, 0x4b, 0x0d, 0x0a, 0x43, 0x6f, 0x6e, 0x74, 0x65, 0x6e, 0x74, 0x2d, 0x54, 0x79,
  0x70, 0x65, 0x3a, 0x20, 0x69, 0x6d, 0x61, 0x67, 0x65, 0x2f, 0x70, 0x6e, 0x67, 0x0d, 0x0a, 0x89,
  0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52, 0x00,
  0x00,
];

const FORMATTED_TCP_FIN = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x36, 0x9d, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x36, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0xf7, 0x00, 0x00, 0x06, 0x99, 0x50, 0x11,
  0xfa, 0xf0, 0xe5, 0x9e, 0x00, 0x00,
];

const FORMATTED_TCP_FINACK = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x00, 0x01, 0x40, 0x00, 0x40, 0x06, 0x9c, 0xd2, 0x5d, 0xb8, 0xd8, 0x22, 0xc0, 0xa8,
  0x01, 0x64, 0x00, 0x50, 0xc0, 0x00, 0x00, 0x06, 0x99, 0x00, 0x00, 0x00, 0xf8, 0x50, 0x11, 0xfa,
  0xf0, 0x93, 0x10, 0x00, 0x00,
];

const FORMATTED_TCP_ACK_LAST = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x36, 0x9e, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x35, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0xf8, 0x00, 0x00, 0x06, 0x9a, 0x50, 0x10,
  0xfa, 0xf0, 0xe5, 0x9c, 0x00, 0x00,
];

const FORMATTED_TCP_HTTP_ACK = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x36, 0x9b, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x38, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x00, 0x5f, 0x00, 0x00, 0x01, 0xd3, 0x50, 0x10,
  0xfa, 0xf0, 0xe5, 0x28, 0x00, 0x00,
];

const FORMATTED_TCP_IMAGE_ACK = [
  0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5f, 0x00, 0x1a, 0x2b, 0x3c, 0x4d, 0x5e, 0x08, 0x00, 0x45, 0x00,
  0x00, 0x28, 0x36, 0x9d, 0x40, 0x00, 0x40, 0x06, 0xa5, 0x36, 0xc0, 0xa8, 0x01, 0x64, 0x5d, 0xb8,
  0xd8, 0x22, 0xc0, 0x00, 0x00, 0x50, 0x00, 0x00, 0x01, 0xd4, 0x00, 0x00, 0x06, 0x98, 0x50, 0x10,
  0xfa, 0xf0, 0xe4, 0x9e, 0x00, 0x00,
];

const PACKETS: Packet[] = [
  {
    no: 1, time: "0.000000", src: "192.168.1.100", dst: "8.8.8.8",
    protocol: "DNS", length: 72, info: "Standard query 0x0123 A example.com",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "8.8.8.8", ttl: 64, ipProtocol: "UDP (17)",
    srcPort: 59394, dstPort: 53, seq: "---", ack: "---", flags: ["---"],
    app: { query: "example.com A" }, rawBytes: FORMATTED_DNS_QUERY,
  },
  {
    no: 2, time: "0.002345", src: "8.8.8.8", dst: "192.168.1.100",
    protocol: "DNS", length: 82, info: "Standard response 0x0123 A 93.184.216.34",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "8.8.8.8", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "UDP (17)",
    srcPort: 53, dstPort: 59394, seq: "---", ack: "---", flags: ["---"],
    app: { answer: "93.184.216.34" }, rawBytes: FORMATTED_DNS_RESPONSE,
  },
  {
    no: 3, time: "0.003100", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 70, info: "49152 → 80 [SYN] Seq=0 Win=64240",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "0", ack: "0", flags: ["SYN"],
    rawBytes: FORMATTED_TCP_SYN,
  },
  {
    no: 4, time: "0.012500", src: "93.184.216.34", dst: "192.168.1.100",
    protocol: "TCP", length: 70, info: "80 → 49152 [SYN, ACK] Seq=0 Ack=1 Win=64240",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "93.184.216.34", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "TCP (6)",
    srcPort: 80, dstPort: 49152, seq: "0", ack: "1", flags: ["SYN", "ACK"],
    rawBytes: FORMATTED_TCP_SYNACK,
  },
  {
    no: 5, time: "0.012600", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 54, info: "49152 → 80 [ACK] Seq=1 Ack=1 Win=64240",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "1", ack: "1", flags: ["ACK"],
    rawBytes: FORMATTED_TCP_ACK,
  },
  {
    no: 6, time: "0.013000", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "HTTP", length: 148, info: "GET /index.html HTTP/1.1",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "1", ack: "1", flags: ["PSH", "ACK"],
    app: { method: "GET", uri: "/index.html", version: "HTTP/1.1" },
    rawBytes: FORMATTED_HTTP_GET,
  },
  {
    no: 7, time: "0.045200", src: "93.184.216.34", dst: "192.168.1.100",
    protocol: "HTTP", length: 520, info: "HTTP/1.1 200 OK (text/html)",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "93.184.216.34", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "TCP (6)",
    srcPort: 80, dstPort: 49152, seq: "1", ack: "95", flags: ["PSH", "ACK"],
    app: { status: "200 OK", contentType: "text/html" },
    rawBytes: FORMATTED_HTTP_RESPONSE,
  },
  {
    no: 8, time: "0.045300", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 54, info: "49152 → 80 [ACK] Seq=95 Ack=467 Win=63720",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "95", ack: "467", flags: ["ACK"],
    rawBytes: FORMATTED_TCP_HTTP_ACK,
  },
  {
    no: 9, time: "0.045800", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "HTTP", length: 152, info: "GET /logo.png HTTP/1.1",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "95", ack: "467", flags: ["PSH", "ACK"],
    app: { method: "GET", uri: "/logo.png", version: "HTTP/1.1" },
    rawBytes: FORMATTED_HTTP_GET_IMAGE,
  },
  {
    no: 10, time: "0.062100", src: "93.184.216.34", dst: "192.168.1.100",
    protocol: "HTTP", length: 1250, info: "HTTP/1.1 200 OK (image/png)",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "93.184.216.34", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "TCP (6)",
    srcPort: 80, dstPort: 49152, seq: "467", ack: "247", flags: ["PSH", "ACK"],
    app: { status: "200 OK", contentType: "image/png" },
    rawBytes: FORMATTED_HTTP_RESPONSE_IMAGE,
  },
  {
    no: 11, time: "0.062200", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 54, info: "49152 → 80 [ACK] Seq=247 Ack=1689 Win=62400",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "247", ack: "1689", flags: ["ACK"],
    rawBytes: FORMATTED_TCP_IMAGE_ACK,
  },
  {
    no: 12, time: "0.065000", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TLS", length: 256, info: "Client Hello (SNI: example.com)",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49153, dstPort: 443, seq: "0", ack: "0", flags: ["SYN"],
    app: { sni: "example.com", version: "TLS 1.2" },
    rawBytes: FORMATTED_TCP_SYN,
  },
  {
    no: 13, time: "0.072300", src: "93.184.216.34", dst: "192.168.1.100",
    protocol: "TLS", length: 312, info: "Server Hello + Certificate",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "93.184.216.34", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "TCP (6)",
    srcPort: 443, dstPort: 49153, seq: "0", ack: "1", flags: ["SYN", "ACK"],
    app: { version: "TLS 1.2" },
    rawBytes: FORMATTED_TCP_SYNACK,
  },
  {
    no: 14, time: "3.500000", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 54, info: "49152 → 80 [FIN, ACK] Seq=247 Ack=1689 Win=62400",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "247", ack: "1689", flags: ["FIN", "ACK"],
    rawBytes: FORMATTED_TCP_FIN,
  },
  {
    no: 15, time: "3.512000", src: "93.184.216.34", dst: "192.168.1.100",
    protocol: "TCP", length: 54, info: "80 → 49152 [FIN, ACK] Seq=1689 Ack=248 Win=64240",
    srcMac: "00:1a:2b:3c:4d:5f", dstMac: "00:1a:2b:3c:4d:5e",
    ipSrc: "93.184.216.34", ipDst: "192.168.1.100", ttl: 128, ipProtocol: "TCP (6)",
    srcPort: 80, dstPort: 49152, seq: "1689", ack: "248", flags: ["FIN", "ACK"],
    rawBytes: FORMATTED_TCP_FINACK,
  },
  {
    no: 16, time: "3.512100", src: "192.168.1.100", dst: "93.184.216.34",
    protocol: "TCP", length: 54, info: "49152 → 80 [ACK] Seq=248 Ack=1690 Win=62400",
    srcMac: "00:1a:2b:3c:4d:5e", dstMac: "00:1a:2b:3c:4d:5f",
    ipSrc: "192.168.1.100", ipDst: "93.184.216.34", ttl: 64, ipProtocol: "TCP (6)",
    srcPort: 49152, dstPort: 80, seq: "248", ack: "1690", flags: ["ACK"],
    rawBytes: FORMATTED_TCP_ACK_LAST,
  },
];

function formatHexDump(bytes: number[]): string[] {
  const lines: string[] = [];
  for (let i = 0; i < bytes.length; i += 16) {
    const offset = i.toString(16).padStart(4, "0");
    const chunk = bytes.slice(i, i + 16);
    const hexParts: string[] = [];
    const asciiParts: string[] = [];
    for (let j = 0; j < 16; j++) {
      if (j < chunk.length) {
        hexParts.push(chunk[j].toString(16).padStart(2, "0").toUpperCase());
        const b = chunk[j];
        asciiParts.push(b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : ".");
      } else {
        hexParts.push("  ");
        asciiParts.push(" ");
      }
    }
    const hex1 = hexParts.slice(0, 8).join(" ");
    const hex2 = hexParts.slice(8, 16).join(" ");
    const ascii = asciiParts.join("");
    lines.push(`${offset}  ${hex1}  ${hex2}  ${ascii}`);
  }
  return lines;
}

const protocolColors: Record<Protocol, string> = {
  DNS: "text-purple-400",
  TCP: "text-blue-400",
  HTTP: "text-green-400",
  TLS: "text-yellow-400",
};

const protocolBgColors: Record<Protocol, string> = {
  DNS: "bg-purple-900/40 border-purple-700",
  TCP: "bg-blue-900/40 border-blue-700",
  HTTP: "bg-green-900/40 border-green-700",
  TLS: "bg-yellow-900/40 border-yellow-700",
};

const features = [
  {
    icon: Search, title: "Display Filters",
    desc: "Filter packets using expressions like `http`, `tcp.port == 80`, or `ip.addr == 192.168.1.1` to isolate specific traffic.",
  },
  {
    icon: Filter, title: "Capture Filters",
    desc: "Use BPF syntax to capture only relevant traffic: `host 93.184.216.34`, `port 80`, or `tcp`.",
  },
  {
    icon: Activity, title: "Follow TCP Stream",
    desc: "Reconstruct the full TCP conversation between two endpoints to see the raw application-layer data exchange.",
  },
  {
    icon: BarChart3, title: "IO Graphs & Statistics",
    desc: "Visualize throughput, packet rates, protocol hierarchy, and endpoint conversations with built-in graphing tools.",
  },
  {
    icon: Server, title: "Protocol Hierarchy",
    desc: "View a tree of all detected protocols with packet counts and percentages to understand traffic composition.",
  },
  {
    icon: Download, title: "Export Objects",
    desc: "Extract files (images, executables, documents) transferred over HTTP, SMB, or other protocols from the capture.",
  },
];

const interviewQuestions = [
  {
    q: "What is Wireshark and how does it capture packets?",
    a: "Wireshark is a network protocol analyzer that captures packets by putting the network interface into promiscuous mode, allowing it to see all traffic passing through the interface. It uses libpcap/WinPcap to capture raw frames from the network adapter.",
  },
  {
    q: "What is the difference between a display filter and a capture filter?",
    a: "Capture filters use BPF (Berkeley Packet Filter) syntax and are applied before capture, dropping non-matching packets entirely. Display filters use Wireshark's own expression syntax and only hide packets from view—they can be changed after capture without re-capturing.",
  },
  {
    q: "How do you analyze a TCP three-way handshake in Wireshark?",
    a: "Filter by `tcp.stream eq <n>` to isolate a TCP flow. The three-way handshake appears as: (1) Client sends [SYN] with Seq=0, (2) Server responds [SYN, ACK] with Seq=0 and Ack=1, (3) Client sends [ACK] with Seq=1 and Ack=1. This establishes the connection.",
  },
  {
    q: "What does the [PSH] flag in a TCP packet mean?",
    a: "The PSH (Push) flag tells the receiving system to deliver the data to the application immediately without buffering. In Wireshark, [PSH, ACK] packets typically carry application-layer payload like HTTP requests or responses.",
  },
  {
    q: "How can you identify a TLS handshake in Wireshark?",
    a: "Filter by `tls` or `ssl`. The TLS handshake begins with Client Hello (containing supported cipher suites and SNI), followed by Server Hello (selected cipher suite and certificate), then key exchange and finished messages. Look for protocol version 0x0303 (TLS 1.2) or 0x0304 (TLS 1.3).",
  },
];

const protocols: Protocol[] = ["DNS", "TCP", "HTTP", "TLS"];

export default function WiresharkPage() {
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [protocolFilter, setProtocolFilter] = useState<Protocol | "All">("All");
  const [expandedLayers, setExpandedLayers] = useState<Set<string>>(new Set(["frame", "ip", "transport", "app"]));

  const filteredPackets = useMemo(() => {
    if (protocolFilter === "All") return PACKETS;
    return PACKETS.filter((p) => p.protocol === protocolFilter);
  }, [protocolFilter]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    let totalBytes = 0;
    for (const p of PACKETS) {
      counts[p.protocol] = (counts[p.protocol] || 0) + 1;
      totalBytes += p.length;
    }
    const maxCount = Math.max(...Object.values(counts), 1);
    return { counts, totalPackets: PACKETS.length, totalBytes, maxCount, avgSize: Math.round(totalBytes / PACKETS.length) };
  }, []);

  const toggleLayer = (layer: string) => {
    setExpandedLayers((prev) => {
      const next = new Set(prev);
      if (next.has(layer)) next.delete(layer);
      else next.add(layer);
      return next;
    });
  };

  const hexDump = selectedPacket ? formatHexDump(selectedPacket.rawBytes) : [];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 4px rgba(34, 211, 238, 0.3); }
          50% { box-shadow: 0 0 12px rgba(34, 211, 238, 0.6); }
        }
        .hex-byte { font-family: 'SF Mono', 'Fira Code', 'Courier New', monospace; }
        .selected-row { background: rgba(34, 211, 238, 0.1) !important; border-left: 3px solid #22d3ee; }
        .packet-row:hover { background: rgba(255, 255, 255, 0.04); }
        .bar-animate { transition: width 0.6s ease-out; }
      `}</style>

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-400 mb-6">
          <Link href="/tools/security" className="hover:text-cyan-400 transition-colors">Security</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-cyan-400 font-semibold">Wireshark</span>
        </nav>
      </div>

      {/* Hero */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 p-6 sm:p-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-500/5 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-900/40 border border-cyan-700/50 rounded-full text-[11px] font-semibold text-cyan-300 mb-4">
              <Network className="w-3.5 h-3.5" /> Packet Analysis Lab
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 leading-tight">
              📡 Wireshark Packet Analyzer
            </h1>
            <p className="text-sm sm:text-base text-gray-400 max-w-3xl leading-relaxed">
              Dive deep into network traffic with an interactive packet analyzer simulator.
              Inspect real-world protocol interactions, decode packet structures, and master
              the art of network forensics — all from your browser.
            </p>
          </div>
        </div>
      </div>

      {/* Theory Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold">What is Wireshark?</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 leading-relaxed">
            <div>
              <strong className="text-gray-200 block mb-1">Packet Capture</strong>
              Wireshark captures live network traffic by placing the network interface in promiscuous mode, recording every packet that passes through. Captures can be saved in PCAP/PCAPNG format for later analysis and sharing.
            </div>
            <div>
              <strong className="text-gray-200 block mb-1">Protocol Decoding</strong>
              Over 3,000 protocol dissectors allow Wireshark to decode everything from Ethernet frames to application-layer protocols like HTTP and DNS, presenting them in a human-readable hierarchical view.
            </div>
            <div>
              <strong className="text-gray-200 block mb-1">Traffic Analysis</strong>
              Analysts use Wireshark for network troubleshooting, security incident investigation, protocol development, and education. Display filters, coloring rules, and statistics help pinpoint issues quickly.
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Packet Analyzer */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Terminal className="w-5 h-5 text-green-400" />
          <h2 className="text-lg sm:text-xl font-bold">Interactive Packet Analyzer Simulator</h2>
        </div>

        {/* Protocol Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(["All", ...protocols] as const).map((p) => (
            <button
              key={p}
              onClick={() => { setProtocolFilter(p); setSelectedPacket(null); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                protocolFilter === p
                  ? "bg-cyan-900/60 border-cyan-500 text-cyan-300 shadow-sm shadow-cyan-500/20"
                  : "bg-gray-800 border-gray-600 text-gray-400 hover:border-gray-500"
              }`}
            >
              {p === "All" ? "All Packets" : p}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-500 self-center">
            {filteredPackets.length} packets
          </span>
        </div>

        {/* Main Simulator Grid */}
        <div className="grid lg:grid-cols-3 gap-4">
          {/* Packet List */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 border-b border-gray-700">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold">Packet List</span>
              <span className="ml-auto text-[11px] text-gray-500">{filteredPackets.length} of {PACKETS.length} packets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-gray-700 bg-gray-800/40">
                    <th className="text-left px-3 py-2 font-semibold w-12">No.</th>
                    <th className="text-left px-3 py-2 font-semibold w-20">Time</th>
                    <th className="text-left px-3 py-2 font-semibold">Source</th>
                    <th className="text-left px-3 py-2 font-semibold">Destination</th>
                    <th className="text-left px-3 py-2 font-semibold w-16">Protocol</th>
                    <th className="text-right px-3 py-2 font-semibold w-14">Length</th>
                    <th className="text-left px-3 py-2 font-semibold">Info</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackets.map((pkt) => (
                    <tr
                      key={pkt.no}
                      onClick={() => setSelectedPacket(pkt)}
                      className={`packet-row cursor-pointer border-b border-gray-800 transition-colors ${
                        selectedPacket?.no === pkt.no ? "selected-row" : ""
                      }`}
                    >
                      <td className="px-3 py-2 text-gray-400">{pkt.no}</td>
                      <td className="px-3 py-2 text-gray-400 font-mono">{pkt.time}</td>
                      <td className="px-3 py-2">{pkt.src}</td>
                      <td className="px-3 py-2">{pkt.dst}</td>
                      <td className={`px-3 py-2 font-bold ${protocolColors[pkt.protocol]}`}>
                        {pkt.protocol}
                      </td>
                      <td className="px-3 py-2 text-right text-gray-400">{pkt.length}</td>
                      <td className="px-3 py-2 text-gray-300">{pkt.info}</td>
                    </tr>
                  ))}
                  {filteredPackets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-8 text-center text-gray-500">
                        No packets match the current filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Packet Details + Hex Dump */}
          <div className="flex flex-col gap-4">
            {/* Packet Details Pane */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 border-b border-gray-700">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold">Packet Details</span>
              </div>
              {selectedPacket ? (
                <div className="text-xs font-mono">
                  {/* Frame (Ethernet) */}
                  <div className="border-b border-gray-800">
                    <button
                      onClick={() => toggleLayer("frame")}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-800/60 transition-colors"
                    >
                      {expandedLayers.has("frame") ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                      <span className="text-cyan-300 font-semibold">Frame (Ethernet)</span>
                    </button>
                    {expandedLayers.has("frame") && (
                      <div className="px-6 pb-2 space-y-1 text-gray-400">
                        <div><span className="text-gray-500">Destination MAC: </span>{selectedPacket.dstMac}</div>
                        <div><span className="text-gray-500">Source MAC: </span>{selectedPacket.srcMac}</div>
                        <div><span className="text-gray-500">Type: </span>IPv4 (0x0800)</div>
                        <div><span className="text-gray-500">Frame length: </span>{selectedPacket.length} bytes</div>
                      </div>
                    )}
                  </div>

                  {/* IP Layer */}
                  <div className="border-b border-gray-800">
                    <button
                      onClick={() => toggleLayer("ip")}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-800/60 transition-colors"
                    >
                      {expandedLayers.has("ip") ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                      <span className="text-cyan-300 font-semibold">Internet Protocol Version 4</span>
                    </button>
                    {expandedLayers.has("ip") && (
                      <div className="px-6 pb-2 space-y-1 text-gray-400">
                        <div><span className="text-gray-500">Source Address: </span>{selectedPacket.ipSrc}</div>
                        <div><span className="text-gray-500">Destination Address: </span>{selectedPacket.ipDst}</div>
                        <div><span className="text-gray-500">Time to Live: </span>{selectedPacket.ttl}</div>
                        <div><span className="text-gray-500">Protocol: </span>{selectedPacket.ipProtocol}</div>
                        <div><span className="text-gray-500">Header Length: </span>20 bytes</div>
                      </div>
                    )}
                  </div>

                  {/* TCP/UDP Layer */}
                  <div className="border-b border-gray-800">
                    <button
                      onClick={() => toggleLayer("transport")}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-800/60 transition-colors"
                    >
                      {expandedLayers.has("transport") ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                      <span className="text-cyan-300 font-semibold">
                        {selectedPacket.protocol === "DNS" ? "User Datagram Protocol" : "Transmission Control Protocol"}
                      </span>
                    </button>
                    {expandedLayers.has("transport") && (
                      <div className="px-6 pb-2 space-y-1 text-gray-400">
                        <div><span className="text-gray-500">Source Port: </span>{selectedPacket.srcPort}</div>
                        <div><span className="text-gray-500">Destination Port: </span>{selectedPacket.dstPort}</div>
                        {selectedPacket.protocol !== "DNS" && (
                          <>
                            <div><span className="text-gray-500">Sequence Number: </span>{selectedPacket.seq}</div>
                            <div><span className="text-gray-500">Acknowledgment Number: </span>{selectedPacket.ack}</div>
                            <div><span className="text-gray-500">Flags: </span>
                              <span className="text-yellow-400">[{selectedPacket.flags.join(", ")}]</span>
                            </div>
                            <div><span className="text-gray-500">Window Size: </span>64240</div>
                          </>
                        )}
                        {selectedPacket.protocol === "DNS" && (
                          <>
                            <div><span className="text-gray-500">Length: </span>{selectedPacket.length - 42}</div>
                            <div><span className="text-gray-500">Checksum: </span>0x0000 (valid)</div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Application Layer */}
                  <div>
                    <button
                      onClick={() => toggleLayer("app")}
                      className="flex items-center gap-2 w-full text-left px-3 py-2 hover:bg-gray-800/60 transition-colors"
                    >
                      {expandedLayers.has("app") ? <ChevronDown className="w-3 h-3 text-cyan-400" /> : <ChevronRight className="w-3 h-3 text-gray-500" />}
                      <span className="text-cyan-300 font-semibold">
                        {selectedPacket.protocol === "DNS" ? "Domain Name System" :
                         selectedPacket.protocol === "HTTP" ? "Hypertext Transfer Protocol" :
                         selectedPacket.protocol === "TLS" ? "Transport Layer Security" : "TCP"}
                      </span>
                    </button>
                    {expandedLayers.has("app") && selectedPacket.app && (
                      <div className="px-6 pb-2 space-y-1 text-gray-400">
                        {selectedPacket.app.query && <div><span className="text-gray-500">Query: </span>{selectedPacket.app.query}</div>}
                        {selectedPacket.app.answer && <div><span className="text-gray-500">Answer: </span>{selectedPacket.app.answer}</div>}
                        {selectedPacket.app.method && <div><span className="text-gray-500">Method: </span>{selectedPacket.app.method}</div>}
                        {selectedPacket.app.uri && <div><span className="text-gray-500">URI: </span>{selectedPacket.app.uri}</div>}
                        {selectedPacket.app.version && <div><span className="text-gray-500">Version: </span>{selectedPacket.app.version}</div>}
                        {selectedPacket.app.status && <div><span className="text-gray-500">Status: </span>{selectedPacket.app.status}</div>}
                        {selectedPacket.app.contentType && <div><span className="text-gray-500">Content-Type: </span>{selectedPacket.app.contentType}</div>}
                        {selectedPacket.app.sni && <div><span className="text-gray-500">SNI: </span>{selectedPacket.app.sni}</div>}
                        {!selectedPacket.app.query && !selectedPacket.app.answer && !selectedPacket.app.method &&
                         !selectedPacket.app.uri && !selectedPacket.app.status && !selectedPacket.app.sni && (
                          <div className="text-gray-500 italic">No application-layer details</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-xs">
                  <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  Select a packet to view its details
                </div>
              )}
            </div>

            {/* Hex Dump Pane */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 border-b border-gray-700">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold">Hex Dump</span>
              </div>
              {selectedPacket ? (
                <div className="overflow-x-auto">
                  <pre className="hex-byte text-[11px] leading-relaxed p-3 text-green-300 bg-gray-950/50 whitespace-pre">
                    {hexDump.map((line, i) => (
                      <div key={i} className="hover:bg-green-900/20 px-2 rounded">
                        <span className="text-gray-600">{line.slice(0, 6)}</span>
                        <span className="text-green-400">{line.slice(6, 49)}</span>
                        <span className="text-gray-500">{line.slice(49)}</span>
                      </div>
                    ))}
                  </pre>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500 text-xs">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  Select a packet to view hex dump
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-5">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg sm:text-xl font-bold">Capture Statistics</h2>
          </div>
          <div className="grid sm:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-2xl font-black text-cyan-400">{stats.totalPackets}</div>
              <div className="text-[11px] text-gray-500">Total Packets</div>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-2xl font-black text-green-400">3.512 s</div>
              <div className="text-[11px] text-gray-500">Capture Duration</div>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-2xl font-black text-yellow-400">{stats.avgSize}</div>
              <div className="text-[11px] text-gray-500">Avg Packet Size (bytes)</div>
            </div>
            <div className="bg-gray-900/60 rounded-lg p-4 border border-gray-700 text-center">
              <div className="text-2xl font-black text-purple-400">{stats.totalBytes}</div>
              <div className="text-[11px] text-gray-500">Total Bytes</div>
            </div>
          </div>
          <div className="space-y-2">
            {protocols.map((proto) => {
              const count = stats.counts[proto] || 0;
              const pct = Math.round((count / stats.totalPackets) * 100);
              return (
                <div key={proto} className="flex items-center gap-3">
                  <span className={`w-16 text-xs font-bold ${protocolColors[proto]}`}>{proto}</span>
                  <div className="flex-1 bg-gray-900 rounded-full h-5 overflow-hidden border border-gray-700">
                    <div
                      className={`h-full rounded-full bar-animate ${protocolBgColors[proto]}`}
                      style={{ width: `${(count / stats.maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-8 text-xs text-gray-400 text-right">{count}</span>
                  <span className="w-10 text-xs text-gray-500 text-right">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wireshark Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-3 mb-5">
          <Wifi className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-bold">Wireshark Features</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-gray-800/40 border border-gray-700 rounded-xl p-4 sm:p-5 hover:border-gray-600 transition-colors">
                <Icon className="w-5 h-5 text-cyan-400 mb-3" />
                <h3 className="text-sm font-bold text-gray-200 mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interview Questions */}
      <div className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-12 sm:pb-16">
        <div className="flex items-center gap-3 mb-5">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <h2 className="text-lg sm:text-xl font-bold">Wireshark Interview Questions</h2>
        </div>
        <div className="space-y-3">
          {interviewQuestions.map((item, i) => (
            <details key={i} className="group bg-gray-800/40 border border-gray-700 rounded-xl overflow-hidden">
              <summary className="flex items-start gap-3 p-4 cursor-pointer list-none hover:bg-gray-800/60 transition-colors">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 text-xs font-bold shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <span className="text-sm font-semibold text-gray-200">{item.q}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 shrink-0 mt-0.5 group-open:rotate-90 transition-transform" />
              </summary>
              <div className="px-4 pb-4 pl-14">
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">{item.a}</p>
              </div>
            </details>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/tools/security">
            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 rounded-xl text-sm font-bold hover:bg-cyan-900/70 transition-all">
              <ArrowRight className="w-4 h-4" /> Back to Security Lab
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
