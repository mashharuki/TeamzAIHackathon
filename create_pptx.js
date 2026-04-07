const pptxgen = require("pptxgenjs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.author = "Team Super Halki";
pres.title = "Super Halki - AI-Powered Person Replication";

// === Color Palette ===
const DARK = "1A1A2E";
const DEEP = "16213E";
const CORAL = "E94560";
const CORAL_LIGHT = "F8D0D8";
const LIGHT_BG = "F5F3EF";
const WHITE = "FFFFFF";
const DARK_TEXT = "1A1A2E";
const MUTED = "7C7C8A";
const CARD_SHADOW = () => ({ type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.1 });

// === Font ===
const HEADER_FONT = "Trebuchet MS";
const BODY_FONT = "Calibri";

// ============================================================
// SLIDE 1: Title
// ============================================================
const s1 = pres.addSlide();
s1.background = { color: DARK };

// Decorative elements
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 0.12, h: 5.625,
  fill: { color: CORAL }
});
s1.addShape(pres.shapes.OVAL, {
  x: 7.0, y: -1.5, w: 5, h: 5,
  fill: { color: DEEP }
});
s1.addShape(pres.shapes.OVAL, {
  x: 8.2, y: 2.8, w: 3.5, h: 3.5,
  fill: { color: CORAL, transparency: 80 }
});

s1.addText("SUPER HALKI", {
  x: 0.8, y: 1.0, w: 8, h: 1.4,
  fontSize: 54, fontFace: HEADER_FONT, bold: true,
  color: WHITE, charSpacing: 5, margin: 0
});
s1.addText("Replicate Anyone's Knowledge with AI", {
  x: 0.8, y: 2.5, w: 7, h: 0.6,
  fontSize: 20, fontFace: BODY_FONT,
  color: CORAL, italic: true, margin: 0
});
s1.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 3.3, w: 2.5, h: 0.04,
  fill: { color: CORAL }
});
s1.addText("Team Super Halki", {
  x: 0.8, y: 4.6, w: 5, h: 0.4,
  fontSize: 14, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

s1.addNotes(
  "Welcome everyone. We are Team Super Halki.\n\n" +
  "Today we're presenting Super Halki, an AI-powered solution that can replicate anyone's knowledge and expertise.\n\n" +
  "Our app creates a digital twin of a person's knowledge base, enabling instant consultations and perspective sharing.\n\n" +
  "Let me walk you through the background, how it works, and what benefits it brings."
);

// ============================================================
// SLIDE 2: Background / The Challenge
// ============================================================
const s2 = pres.addSlide();
s2.background = { color: LIGHT_BG };

// Top coral accent bar
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.06,
  fill: { color: CORAL }
});

s2.addText("THE BACKGROUND", {
  x: 0.8, y: 0.4, w: 8, h: 0.7,
  fontSize: 32, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s2.addText("What makes this possible?", {
  x: 0.8, y: 1.0, w: 6, h: 0.4,
  fontSize: 14, fontFace: BODY_FONT,
  color: MUTED, italic: true, margin: 0
});

// Card 1 - Universal Access
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.7, w: 8.4, h: 1.05,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.7, w: 0.1, h: 1.05,
  fill: { color: CORAL }
});
s2.addShape(pres.shapes.OVAL, {
  x: 1.15, y: 1.88, w: 0.6, h: 0.6,
  fill: { color: CORAL }
});
s2.addText("1", {
  x: 1.15, y: 1.88, w: 0.6, h: 0.6,
  fontSize: 18, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s2.addText("Universal Information Access", {
  x: 2.0, y: 1.8, w: 6.5, h: 0.45,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s2.addText("OpenClaw lets you reference any information exactly when you need it.", {
  x: 2.0, y: 2.2, w: 6.5, h: 0.4,
  fontSize: 13, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

// Card 2 - AI Data Retrieval
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 2.95, w: 8.4, h: 1.05,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 2.95, w: 0.1, h: 1.05,
  fill: { color: CORAL }
});
s2.addShape(pres.shapes.OVAL, {
  x: 1.15, y: 3.13, w: 0.6, h: 0.6,
  fill: { color: CORAL }
});
s2.addText("2", {
  x: 1.15, y: 3.13, w: 0.6, h: 0.6,
  fontSize: 18, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s2.addText("AI-Powered Data Retrieval", {
  x: 2.0, y: 3.05, w: 6.5, h: 0.45,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s2.addText("TiDB enables real-time data retrieval by AI, and Bright Data fetches live information from the web.", {
  x: 2.0, y: 3.45, w: 6.5, h: 0.4,
  fontSize: 13, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

// Card 3 - Person Replication
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 4.2, w: 8.4, h: 1.05,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s2.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 4.2, w: 0.1, h: 1.05,
  fill: { color: CORAL }
});
s2.addShape(pres.shapes.OVAL, {
  x: 1.15, y: 4.38, w: 0.6, h: 0.6,
  fill: { color: CORAL }
});
s2.addText("3", {
  x: 1.15, y: 4.38, w: 0.6, h: 0.6,
  fontSize: 18, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s2.addText("Digital Person Replication", {
  x: 2.0, y: 4.3, w: 6.5, h: 0.45,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s2.addText("Combine these technologies to recreate a person's knowledge and perspective digitally.", {
  x: 2.0, y: 4.7, w: 6.5, h: 0.4,
  fontSize: 13, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

s2.addNotes(
  "Let me explain the background behind Super Halki.\n\n" +
  "First, OpenClaw provides universal information access - it allows you to reference various information exactly when you need it.\n\n" +
  "Second, by leveraging technologies like TiDB for database-powered AI retrieval and Bright Data for live web scraping, AI can fetch any information on demand.\n\n" +
  "When you combine all of these capabilities, you can actually replicate a person's knowledge digitally. That's the core insight behind Super Halki."
);

// ============================================================
// SLIDE 3: App Name Reveal
// ============================================================
const s3 = pres.addSlide();
s3.background = { color: DARK };

// Large decorative circle
s3.addShape(pres.shapes.OVAL, {
  x: 2.5, y: 0.3, w: 5, h: 5,
  fill: { color: DEEP }
});
s3.addShape(pres.shapes.OVAL, {
  x: 3.0, y: 0.8, w: 4, h: 4,
  fill: { color: CORAL, transparency: 85 }
});

s3.addText("Introducing", {
  x: 1, y: 1.3, w: 8, h: 0.6,
  fontSize: 18, fontFace: BODY_FONT,
  color: MUTED, align: "center", margin: 0
});
s3.addText("SUPER HALKI", {
  x: 1, y: 1.9, w: 8, h: 1.5,
  fontSize: 60, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", charSpacing: 6, margin: 0
});
s3.addShape(pres.shapes.RECTANGLE, {
  x: 3.8, y: 3.5, w: 2.4, h: 0.04,
  fill: { color: CORAL }
});
s3.addText("Your AI Knowledge Twin", {
  x: 1, y: 3.8, w: 8, h: 0.6,
  fontSize: 20, fontFace: BODY_FONT,
  color: CORAL, align: "center", italic: true, margin: 0
});

s3.addNotes(
  "And so, we built Super Halki.\n\n" +
  "Super Halki is your AI Knowledge Twin - it takes someone's public information, expertise, and perspective, and creates a digital version that you can consult anytime.\n\n" +
  "Think of it as having a personal advisor available 24/7, powered by real data about real people."
);

// ============================================================
// SLIDE 4: Demo - How It Works
// ============================================================
const s4 = pres.addSlide();
s4.background = { color: LIGHT_BG };

s4.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.06,
  fill: { color: CORAL }
});

s4.addText("HOW IT WORKS", {
  x: 0.8, y: 0.35, w: 8, h: 0.7,
  fontSize: 32, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s4.addText("Three simple steps to replicate knowledge", {
  x: 0.8, y: 0.95, w: 6, h: 0.4,
  fontSize: 14, fontFace: BODY_FONT,
  color: MUTED, italic: true, margin: 0
});

// Step 1
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.7, w: 2.7, h: 3.2,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 0.5, y: 1.7, w: 2.7, h: 0.08,
  fill: { color: CORAL }
});
s4.addShape(pres.shapes.OVAL, {
  x: 1.45, y: 2.05, w: 0.8, h: 0.8,
  fill: { color: CORAL }
});
s4.addText("1", {
  x: 1.45, y: 2.05, w: 0.8, h: 0.8,
  fontSize: 28, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s4.addText("Share a URL", {
  x: 0.8, y: 3.0, w: 2.1, h: 0.5,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, align: "center", margin: 0
});
s4.addText("Pass any URL to the AI, and it automatically fetches all the relevant data from that source.", {
  x: 0.7, y: 3.5, w: 2.3, h: 1.2,
  fontSize: 12, fontFace: BODY_FONT,
  color: MUTED, align: "center", margin: 0
});

// Arrow 1
s4.addShape(pres.shapes.LINE, {
  x: 3.35, y: 3.1, w: 0.5, h: 0,
  line: { color: CORAL, width: 2.5, dashType: "solid" }
});
// arrowhead
s4.addText(">", {
  x: 3.65, y: 2.9, w: 0.4, h: 0.4,
  fontSize: 18, fontFace: BODY_FONT, bold: true,
  color: CORAL, align: "center", valign: "middle", margin: 0
});

// Step 2
s4.addShape(pres.shapes.RECTANGLE, {
  x: 3.65, y: 1.7, w: 2.7, h: 3.2,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 3.65, y: 1.7, w: 2.7, h: 0.08,
  fill: { color: CORAL }
});
s4.addShape(pres.shapes.OVAL, {
  x: 4.6, y: 2.05, w: 0.8, h: 0.8,
  fill: { color: CORAL }
});
s4.addText("2", {
  x: 4.6, y: 2.05, w: 0.8, h: 0.8,
  fontSize: 28, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s4.addText("Generate SOUL.md", {
  x: 3.85, y: 3.0, w: 2.3, h: 0.5,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, align: "center", margin: 0
});
s4.addText("The AI analyzes the data and automatically creates a SOUL.md file that captures the person's knowledge profile.", {
  x: 3.85, y: 3.5, w: 2.3, h: 1.2,
  fontSize: 12, fontFace: BODY_FONT,
  color: MUTED, align: "center", margin: 0
});

// Arrow 2
s4.addShape(pres.shapes.LINE, {
  x: 6.5, y: 3.1, w: 0.5, h: 0,
  line: { color: CORAL, width: 2.5, dashType: "solid" }
});
s4.addText(">", {
  x: 6.8, y: 2.9, w: 0.4, h: 0.4,
  fontSize: 18, fontFace: BODY_FONT, bold: true,
  color: CORAL, align: "center", valign: "middle", margin: 0
});

// Step 3
s4.addShape(pres.shapes.RECTANGLE, {
  x: 6.8, y: 1.7, w: 2.7, h: 3.2,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s4.addShape(pres.shapes.RECTANGLE, {
  x: 6.8, y: 1.7, w: 2.7, h: 0.08,
  fill: { color: CORAL }
});
s4.addShape(pres.shapes.OVAL, {
  x: 7.75, y: 2.05, w: 0.8, h: 0.8,
  fill: { color: CORAL }
});
s4.addText("3", {
  x: 7.75, y: 2.05, w: 0.8, h: 0.8,
  fontSize: 28, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", valign: "middle", margin: 0
});
s4.addText("Chat as That Person", {
  x: 7.0, y: 3.0, w: 2.3, h: 0.5,
  fontSize: 16, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, align: "center", margin: 0
});
s4.addText("Using the SOUL.md profile, the AI responds as that person, giving you their authentic perspective.", {
  x: 7.0, y: 3.5, w: 2.3, h: 1.2,
  fontSize: 12, fontFace: BODY_FONT,
  color: MUTED, align: "center", margin: 0
});

s4.addNotes(
  "Now let me show you how Super Halki works in three simple steps.\n\n" +
  "Step 1: Share a URL. You simply pass a URL to the AI - this could be someone's blog, LinkedIn profile, or any public content. The AI automatically fetches and processes all the relevant data from that source.\n\n" +
  "Step 2: Generate SOUL.md. Based on the collected data, the system automatically creates a SOUL.md file. This file captures the person's knowledge, expertise, communication style, and perspective in a structured format.\n\n" +
  "Step 3: Chat as That Person. Once the SOUL.md is ready, you can start chatting with the AI, and it will respond as if it were that person. It gives you their authentic perspective, using their knowledge and communication style.\n\n" +
  "Let me show you a quick demo of this in action."
);

// ============================================================
// SLIDE 5: Benefits
// ============================================================
const s5 = pres.addSlide();
s5.background = { color: LIGHT_BG };

s5.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 0, w: 10, h: 0.06,
  fill: { color: CORAL }
});

s5.addText("WHY SUPER HALKI?", {
  x: 0.8, y: 0.4, w: 8, h: 0.7,
  fontSize: 32, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s5.addText("Real value for real use cases", {
  x: 0.8, y: 1.0, w: 6, h: 0.4,
  fontSize: 14, fontFace: BODY_FONT,
  color: MUTED, italic: true, margin: 0
});

// Benefit 1 - Left card
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 4.0, h: 3.2,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s5.addShape(pres.shapes.RECTANGLE, {
  x: 0.8, y: 1.8, w: 4.0, h: 0.08,
  fill: { color: CORAL }
});
// Large number callout
s5.addText("01", {
  x: 1.2, y: 2.1, w: 1.2, h: 0.9,
  fontSize: 42, fontFace: HEADER_FONT, bold: true,
  color: CORAL_LIGHT, margin: 0
});
s5.addText("Instant Expertise\nAccess", {
  x: 1.2, y: 2.9, w: 3.2, h: 0.8,
  fontSize: 18, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s5.addText("When consulting with someone, you can instantly get first-hand information for simple questions without waiting for a response.", {
  x: 1.2, y: 3.8, w: 3.2, h: 1.0,
  fontSize: 13, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

// Benefit 2 - Right card
s5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.8, w: 4.0, h: 3.2,
  fill: { color: WHITE }, shadow: CARD_SHADOW()
});
s5.addShape(pres.shapes.RECTANGLE, {
  x: 5.2, y: 1.8, w: 4.0, h: 0.08,
  fill: { color: CORAL }
});
s5.addText("02", {
  x: 5.6, y: 2.1, w: 1.2, h: 0.9,
  fontSize: 42, fontFace: HEADER_FONT, bold: true,
  color: CORAL_LIGHT, margin: 0
});
s5.addText("User Perspective\nIntegration", {
  x: 5.6, y: 2.9, w: 3.2, h: 0.8,
  fontSize: 18, fontFace: HEADER_FONT, bold: true,
  color: DARK_TEXT, margin: 0
});
s5.addText("Incorporate any user's viewpoint directly into your workflow through a natural chat interface, enriching your decision-making process.", {
  x: 5.6, y: 3.8, w: 3.2, h: 1.0,
  fontSize: 13, fontFace: BODY_FONT,
  color: MUTED, margin: 0
});

s5.addNotes(
  "So why should you use Super Halki? There are two key benefits.\n\n" +
  "First, Instant Expertise Access. When you need to consult with someone - whether it's a domain expert, a thought leader, or a colleague - you can get first-hand information for simple questions instantly. No need to wait for a meeting or a reply. The AI twin provides immediate answers based on that person's actual knowledge and perspective.\n\n" +
  "Second, User Perspective Integration. You can incorporate any user's viewpoint directly into your workflow through chat. This means you can quickly gather diverse perspectives, test your ideas against different viewpoints, and make better-informed decisions. It's like having a focus group available at your fingertips."
);

// ============================================================
// SLIDE 6: Thank You
// ============================================================
const s6 = pres.addSlide();
s6.background = { color: DARK };

// Decorative elements
s6.addShape(pres.shapes.OVAL, {
  x: -1, y: -1, w: 4, h: 4,
  fill: { color: DEEP }
});
s6.addShape(pres.shapes.OVAL, {
  x: 7.5, y: 3, w: 4, h: 4,
  fill: { color: CORAL, transparency: 80 }
});
s6.addShape(pres.shapes.RECTANGLE, {
  x: 0, y: 5.5, w: 10, h: 0.12,
  fill: { color: CORAL }
});

s6.addText("THANK YOU", {
  x: 1, y: 1.5, w: 8, h: 1.3,
  fontSize: 52, fontFace: HEADER_FONT, bold: true,
  color: WHITE, align: "center", charSpacing: 6, margin: 0
});
s6.addShape(pres.shapes.RECTANGLE, {
  x: 3.8, y: 2.9, w: 2.4, h: 0.04,
  fill: { color: CORAL }
});
s6.addText("Team Super Halki", {
  x: 1, y: 3.2, w: 8, h: 0.6,
  fontSize: 20, fontFace: BODY_FONT,
  color: CORAL, align: "center", margin: 0
});
s6.addText("Questions?", {
  x: 1, y: 4.2, w: 8, h: 0.5,
  fontSize: 16, fontFace: BODY_FONT,
  color: MUTED, align: "center", italic: true, margin: 0
});

s6.addNotes(
  "Thank you for your attention.\n\n" +
  "We are Team Super Halki, and we believe that AI-powered knowledge replication will transform how we access expertise and make decisions.\n\n" +
  "We'd love to answer any questions you might have about Super Halki, the technology behind it, or our vision for the future.\n\n" +
  "Thank you!"
);

// === Output ===
pres.writeFile({ fileName: "/Users/babashunsuke/Repository/Hackason/teamz/SuperHalki.pptx" })
  .then(() => console.log("Done: SuperHalki.pptx"))
  .catch(err => console.error(err));
