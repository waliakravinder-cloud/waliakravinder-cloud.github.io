# Build the one-slide pitch as a real .pptx using PowerPoint COM automation.
# Run from PowerShell. Requires Microsoft PowerPoint installed.

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$outDir      = Join-Path $projectRoot 'slides'
$outPath     = Join-Path $outDir 'pitch.pptx'
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
if (Test-Path $outPath)        { Remove-Item $outPath -Force }

Write-Host "Launching PowerPoint..."
$ppt = New-Object -ComObject PowerPoint.Application
# PowerPoint COM does not require Visible=$true, but some installs throw without it.
try { $ppt.Visible = [Microsoft.Office.Core.MsoTriState]::msoTrue } catch { }

# 16:9 widescreen
$pres = $ppt.Presentations.Add($true)
$pres.PageSetup.SlideSize = 15  # ppSlideSizeOnScreen16x9
$pres.PageSetup.SlideWidth  = 960   # points (13.33")
$pres.PageSetup.SlideHeight = 540   # points (7.5")

$slide = $pres.Slides.Add(1, 12) # ppLayoutBlank = 12

# Brand colors
$BRAND = 0x6F3B0B   # 0x00BBGGRR for COM (RGB(11,59,111))
$ACCENT = 0x4D78D1  # RGB(29,120,210)
$DARK  = 0x1E293F   # slate
$MUTED = 0x64748B
$BG_COL = 0xF8FAFC

# ---- Background ----
$bg = $slide.Shapes.AddShape(1, 0, 0, 960, 540)  # msoShapeRectangle
$bg.Fill.ForeColor.RGB = 0xFFFFFF
$bg.Line.Visible = 0

# ---- Header band ----
$header = $slide.Shapes.AddShape(1, 0, 0, 960, 78)
$header.Fill.ForeColor.RGB = $BRAND
$header.Line.Visible = 0

# Title
$title = $slide.Shapes.AddTextbox(1, 28, 12, 700, 60)
$tf = $title.TextFrame.TextRange
$tf.Text = "Smart Civic Engagement Desk"
$tf.Font.Size = 28
$tf.Font.Bold = $true
$tf.Font.Color.RGB = 0xFFFFFF

$sub = $slide.Shapes.AddTextbox(1, 28, 46, 800, 28)
$sf = $sub.TextFrame.TextRange
$sf.Text = "Track and reward citizens. Empower agents. AI-guided next-best actions."
$sf.Font.Size = 12
$sf.Font.Color.RGB = 0xCFE2FF

# Right tag
$tag = $slide.Shapes.AddTextbox(1, 750, 22, 200, 30)
$tagf = $tag.TextFrame.TextRange
$tagf.Text = "AI HACKATHON 2026"
$tagf.Font.Size = 11
$tagf.Font.Bold = $true
$tagf.Font.Color.RGB = 0xFFFFFF
$tagf.ParagraphFormat.Alignment = 3  # right

# ---- Helper: column card ----
function Add-Column($x, $y, $w, $h, $emoji, $title, $bullets) {
    $card = $slide.Shapes.AddShape(5, $x, $y, $w, $h) # msoShapeRoundedRectangle = 5
    $card.Adjustments.Item(1) = 0.06
    $card.Fill.ForeColor.RGB = $BG_COL
    $card.Line.ForeColor.RGB = 0xE2E8F0
    $card.Line.Weight = 0.75

    $head = $slide.Shapes.AddTextbox(1, $x + 10, $y + 8, $w - 20, 26)
    $h1 = $head.TextFrame.TextRange
    $h1.Text = "$emoji  $title"
    $h1.Font.Size = 13
    $h1.Font.Bold = $true
    $h1.Font.Color.RGB = $BRAND

    $body = $slide.Shapes.AddTextbox(1, $x + 12, $y + 36, $w - 24, $h - 44)
    $body.TextFrame.WordWrap = $true
    $body.TextFrame.MarginLeft = 0
    $body.TextFrame.MarginRight = 0
    $first = $true
    foreach ($b in $bullets) {
        if ($first) {
            $r = $body.TextFrame.TextRange
            $r.Text = "• $b"
            $first = $false
        } else {
            $body.TextFrame.TextRange.InsertAfter("`r• $b")
        }
    }
    $body.TextFrame.TextRange.Font.Size = 10
    $body.TextFrame.TextRange.Font.Color.RGB = $DARK
    $body.TextFrame.TextRange.ParagraphFormat.SpaceAfter = 2
}

# Layout: 4 columns
$colY = 100
$colH = 230
$gap  = 12
$margin = 24
$colW = [int](($pres.PageSetup.SlideWidth - 2 * $margin - 3 * $gap) / 4)

Add-Column ($margin                       ) $colY $colW $colH "🎯" "Problem" @(
    "Agents lack context when citizens call/email/visit.",
    "Civic engagement isn't recognized or rewarded.",
    "Recommendations are generic, not personal.",
    "CX feedback rarely reaches managers in time."
)
Add-Column ($margin + 1*($colW + $gap)    ) $colY $colW $colH "💡" "Solution" @(
    "Citizen Dashboard - points, tier, history, AI tips.",
    "Agent Desk - 360 view, milestone scripts, KB, 1-click enroll.",
    "Supervisor view - CSAT KPIs and auto coaching flags.",
    "Append-only ledger for points and audit."
)
Add-Column ($margin + 2*($colW + $gap)    ) $colY $colW $colH "🤖" "AI Approach" @(
    "Rule-based recommender (interests, tier, recency, threshold).",
    "LLM rationale rewriter (gpt-4o-mini, JSON mode).",
    "Guardrails: PII regex, prohibited-promise filter, length cap.",
    "Graceful fallback when LLM is down."
)
Add-Column ($margin + 3*($colW + $gap)    ) $colY $colW $colH "📈" "Impact" @(
    "Higher volunteer/event participation via personalized nudges.",
    "Higher first-call resolution with KB and history at hand.",
    "Higher CSAT through milestone recognition and faster service.",
    "Faster coaching from automated flagging."
)

# ---- Flow band ----
$flowY = $colY + $colH + 14
$flowCard = $slide.Shapes.AddShape(5, $margin, $flowY, ($pres.PageSetup.SlideWidth - 2*$margin), 80)
$flowCard.Adjustments.Item(1) = 0.08
$flowCard.Fill.ForeColor.RGB = $BG_COL
$flowCard.Line.ForeColor.RGB = 0xE2E8F0

$fhead = $slide.Shapes.AddTextbox(1, $margin + 12, $flowY + 8, 400, 22)
$fhead.TextFrame.TextRange.Text = "🔁  End-to-end flow"
$fhead.TextFrame.TextRange.Font.Size = 13
$fhead.TextFrame.TextRange.Font.Bold = $true
$fhead.TextFrame.TextRange.Font.Color.RGB = $BRAND

$fbody = $slide.Shapes.AddTextbox(1, $margin + 12, $flowY + 32, ($pres.PageSetup.SlideWidth - 2*$margin - 24), 44)
$fb = $fbody.TextFrame.TextRange
$fb.Text = "Citizen acts  →  Engagement ledger  →  AI recommender  →  Agent Desk surfaces context and next-best actions  →  Agent enrolls / resolves  →  Citizen rates  →  Supervisor sees CSAT and coaching flags."
$fb.Font.Size = 11
$fb.Font.Color.RGB = $DARK

# ---- Tools chips ----
$toolsY = $flowY + 90
$toolsLbl = $slide.Shapes.AddTextbox(1, $margin, $toolsY, 120, 22)
$toolsLbl.TextFrame.TextRange.Text = "🛠  Tools used:"
$toolsLbl.TextFrame.TextRange.Font.Size = 11
$toolsLbl.TextFrame.TextRange.Font.Bold = $true
$toolsLbl.TextFrame.TextRange.Font.Color.RGB = $BRAND

$tools = @("GitHub Copilot", "OpenAI gpt-4o-mini", "Tailwind CDN", "Vanilla JS", "localStorage", "Rule engine")
$tx = $margin + 110
foreach ($t in $tools) {
    $w = [Math]::Max(80, ($t.Length * 6.2) + 14)
    $chip = $slide.Shapes.AddShape(5, $tx, $toolsY, $w, 22)
    $chip.Adjustments.Item(1) = 0.5
    $chip.Fill.ForeColor.RGB = $BRAND
    $chip.Line.Visible = 0
    $chip.TextFrame.TextRange.Text = $t
    $chip.TextFrame.TextRange.Font.Size = 9
    $chip.TextFrame.TextRange.Font.Color.RGB = 0xFFFFFF
    $chip.TextFrame.TextRange.Font.Bold = $true
    $chip.TextFrame.MarginTop = 2; $chip.TextFrame.MarginBottom = 2
    $tx += $w + 6
}

# ---- Footer ----
$footY = $pres.PageSetup.SlideHeight - 26
$foot = $slide.Shapes.AddTextbox(1, $margin, $footY, ($pres.PageSetup.SlideWidth - 2*$margin), 22)
$foot.TextFrame.TextRange.Text = "Deliverables: User stories • Test cases • Wireframes • Working demo • This pitch        Open app/index.html to demo (zero install)"
$foot.TextFrame.TextRange.Font.Size = 9
$foot.TextFrame.TextRange.Font.Color.RGB = $MUTED

# ---- Save ----
# 24 = ppSaveAsOpenXMLPresentation (.pptx)
$pres.SaveAs($outPath, 24)
$pres.Close()
$ppt.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null

Write-Host "Saved: $outPath"
