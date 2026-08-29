export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterContent {
  brandSentence: string;
  navItems: NavItem[];
}
