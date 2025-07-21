export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "রক্তদাতা তালিকা - জরুরি রক্তদান",
    "url": "https://gienie.xyz",
    "description": "মাইলস্টোন কলেজ বিমান দুর্ঘটনার আহতদের জন্য জরুরি রক্তদান প্ল্যাটফর্ম। দ্রুত রক্তদাতা খুঁজুন এবং জীবন বাঁচাতে সাহায্য করুন।",
    "foundingDate": "2024-07-21",
    "founder": {
      "@type": "Organization",
      "name": "Increments Inc.",
      "url": "https://incrementsinc.com"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Bangladesh"
    },
    "serviceType": "Emergency Blood Donation Services",
    "potentialAction": {
      "@type": "DonateAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://gienie.xyz",
        "description": "জরুরি রক্তদানের জন্য নিবন্ধন করুন"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}