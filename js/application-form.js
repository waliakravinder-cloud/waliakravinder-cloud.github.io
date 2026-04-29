/*
  File: js/application-form.js
  Purpose: Mock application submission and document upload interactions.
*/

(function initApplicationForm() {
  const uploadZone = document.getElementById("upload-zone");
  const fileInput = document.getElementById("document-files");
  const fileList = document.getElementById("file-list");
  const form = document.getElementById("application-form");
  const status = document.getElementById("application-status");

  if (!uploadZone || !fileInput || !fileList || !form || !status) {
    return;
  }

  const selectedFiles = [];

  function renderFiles() {
    if (!selectedFiles.length) {
      fileList.innerHTML = '<li class="card">No documents selected yet.</li>';
      return;
    }

    fileList.innerHTML = selectedFiles
      .map(function toListItem(file, index) {
        return (
          '<li class="card">' +
          '<strong>' + file.name + '</strong> (' + Math.max(1, Math.round(file.size / 1024)) + ' KB) ' +
          '<button type="button" class="btn btn-outline" data-remove-index="' + index + '">Remove</button>' +
          '</li>'
        );
      })
      .join("");
  }

  function addFiles(files) {
    Array.from(files).forEach(function pushFile(file) {
      selectedFiles.push(file);
    });
    renderFiles();
  }

  uploadZone.addEventListener("dragover", function onDragOver(event) {
    event.preventDefault();
    uploadZone.classList.add("dragover");
  });

  uploadZone.addEventListener("dragleave", function onDragLeave() {
    uploadZone.classList.remove("dragover");
  });

  uploadZone.addEventListener("drop", function onDrop(event) {
    event.preventDefault();
    uploadZone.classList.remove("dragover");
    if (event.dataTransfer && event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  });

  fileInput.addEventListener("change", function onChooseFiles() {
    if (fileInput.files) {
      addFiles(fileInput.files);
    }
  });

  fileList.addEventListener("click", function onRemove(event) {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const index = Number(target.getAttribute("data-remove-index"));
    if (!Number.isNaN(index)) {
      selectedFiles.splice(index, 1);
      renderFiles();
    }
  });

  form.addEventListener("submit", function onSubmit(event) {
    event.preventDefault();

    const appDraft = {
      submittedAt: new Date().toISOString(),
      applicantName: String(form.elements.applicantName.value || ""),
      programType: String(form.elements.programType.value || ""),
      files: selectedFiles.map(function toMeta(file) {
        return { name: file.name, size: file.size };
      })
    };

    localStorage.setItem("portalMockApplication", JSON.stringify(appDraft));
    status.textContent = "Application saved as mock draft. No real submission was made.";
    status.className = "alert success";
  });

  renderFiles();
})();
