(function () {
  function escapeHtml(input) {
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function renderInline(input) {
    var text = escapeHtml(input);
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    text = text.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    return text;
  }

  function isTableSeparator(line) {
    return /^\s*\|?\s*[:\- ]+\|[:\-| ]+\|?\s*$/.test(line);
  }

  function parseTable(lines, startIndex) {
    var headerLine = lines[startIndex] || "";
    var sepLine = lines[startIndex + 1] || "";
    if (headerLine.indexOf("|") === -1 || !isTableSeparator(sepLine)) {
      return null;
    }

    var rowIndex = startIndex + 2;
    var rowLines = [];
    while (rowIndex < lines.length && lines[rowIndex].indexOf("|") !== -1 && lines[rowIndex].trim() !== "") {
      rowLines.push(lines[rowIndex]);
      rowIndex += 1;
    }

    function toCells(row) {
      var clean = row.trim();
      if (clean.charAt(0) === "|") clean = clean.slice(1);
      if (clean.charAt(clean.length - 1) === "|") clean = clean.slice(0, -1);
      return clean.split("|").map(function (cell) { return renderInline(cell.trim()); });
    }

    var headerCells = toCells(headerLine);
    var thead = "<thead><tr>" + headerCells.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead>";
    var tbody = "<tbody>" + rowLines.map(function (row) {
      var cells = toCells(row);
      return "<tr>" + cells.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>";
    }).join("") + "</tbody>";

    return {
      html: "<table>" + thead + tbody + "</table>",
      nextIndex: rowIndex
    };
  }

  function renderMarkdown(markdown) {
    var lines = markdown.replace(/\r\n/g, "\n").split("\n");
    var html = [];
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];
      var trimmed = line.trim();

      if (trimmed === "") {
        i += 1;
        continue;
      }

      if (/^```/.test(trimmed)) {
        var codeLines = [];
        i += 1;
        while (i < lines.length && !/^```/.test(lines[i].trim())) {
          codeLines.push(lines[i]);
          i += 1;
        }
        if (i < lines.length) i += 1;
        html.push("<pre><code>" + escapeHtml(codeLines.join("\n")) + "</code></pre>");
        continue;
      }

      var table = parseTable(lines, i);
      if (table) {
        html.push(table.html);
        i = table.nextIndex;
        continue;
      }

      if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
        html.push("<hr>");
        i += 1;
        continue;
      }

      var headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
      if (headingMatch) {
        var level = headingMatch[1].length;
        html.push("<h" + level + ">" + renderInline(headingMatch[2]) + "</h" + level + ">");
        i += 1;
        continue;
      }

      if (/^([-*+])\s+/.test(trimmed)) {
        var ulItems = [];
        while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
          ulItems.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
          i += 1;
        }
        html.push("<ul>" + ulItems.map(function (item) { return "<li>" + renderInline(item) + "</li>"; }).join("") + "</ul>");
        continue;
      }

      if (/^\d+\.\s+/.test(trimmed)) {
        var olItems = [];
        while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
          olItems.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
          i += 1;
        }
        html.push("<ol>" + olItems.map(function (item) { return "<li>" + renderInline(item) + "</li>"; }).join("") + "</ol>");
        continue;
      }

      var paragraph = [line];
      i += 1;
      while (i < lines.length && lines[i].trim() !== "") {
        if (/^(#{1,6})\s+/.test(lines[i].trim()) || /^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]) || /^```/.test(lines[i].trim())) {
          break;
        }
        var maybeTable = parseTable(lines, i);
        if (maybeTable) break;
        paragraph.push(lines[i]);
        i += 1;
      }
      html.push("<p>" + renderInline(paragraph.join(" ").trim()) + "</p>");
    }

    return html.join("\n");
  }

  window.MarkdownViewer = {
    render: renderMarkdown
  };
}());
