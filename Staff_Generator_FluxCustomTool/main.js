/** @type {FluxCustomTools.PanelToolModule} */
var tool = {
  mount: function (context) {
    var root = context.root;
    var sdk = context.FluxSDK;
    var state = {
      config: null,
      activePresetId: "default",
      suppressPresetTracking: false,
      importDocument: null,
      importLaneIndex: -1,
      importPathText: "",
      importLoadToken: 0
    };
    // 設定と読み込んだ譜面はパネルの実行中だけ保持し、永続化しない。
    var numericFieldIds = [
      "length", "staffSize", "staffLineThickness", "positionX", "positionY",
      "overallScale", "measures", "rhythmDensity", "restDensity", "melodyMotion",
      "repetitionTendency", "symbolScale", "noteScale", "stemThickness",
      "beamThickness", "barlineThickness", "ledgerLineThickness", "globalThickness"
    ];
    var customPresetFields = [
      "rhythmDensity", "restDensity", "melodyMotion", "repetitionTendency", "beam", "accidentals"
    ];

    function byId(id) {
      return root.getElementById(id);
    }

    function clearChildren(element) {
      while (element && element.firstChild) {
        element.removeChild(element.firstChild);
      }
    }

    function setDropdownValue(wrapperId, value) {
      var wrapper = byId(wrapperId);
      var items;
      var label;
      var i;
      var selected;
      if (!wrapper) { return; }
      items = wrapper.querySelectorAll(".flux-dropdown-item");
      label = wrapper.querySelector(".flux-dropdown-label");
      selected = null;
      for (i = 0; i < items.length; i += 1) {
        var isSelected = items[i].getAttribute("data-value") === String(value);
        items[i].classList.toggle("active", isSelected);
        items[i].setAttribute("aria-selected", isSelected ? "true" : "false");
        if (isSelected) { selected = items[i]; }
      }
      if (label && selected) { label.textContent = selected.textContent.trim(); }
    }

    function getDropdownValue(wrapperId) {
      var wrapper = byId(wrapperId);
      var selected;
      if (!wrapper) { return ""; }
      selected = wrapper.querySelector(".flux-dropdown-item.active");
      return selected ? selected.getAttribute("data-value") : "";
    }

    function makeDropdown(slotId, wrapperId, triggerId, panelId, listId, labelId, labelText, items, selectedValue, onSelect) {
      var slot = byId(slotId);
      var document = root.ownerDocument;
      var wrapper = document.createElement("div");
      var trigger = document.createElement("div");
      var label = document.createElement("span");
      var arrow = document.createElement("span");
      var panel = document.createElement("div");
      var list = document.createElement("div");
      var i;
      var selectedFound = false;
      clearChildren(slot);
      wrapper.id = wrapperId;
      wrapper.className = "flux-dropdown flux-native-compact-dropdown";
      wrapper.setAttribute("aria-expanded", "false");
      trigger.id = triggerId;
      trigger.className = "flux-dropdown-trigger flux-native-compact-dropdown-trigger";
      trigger.setAttribute("role", "button");
      trigger.setAttribute("tabindex", "0");
      trigger.setAttribute("aria-haspopup", "listbox");
      trigger.setAttribute("aria-expanded", "false");
      trigger.setAttribute("aria-controls", panelId);
      trigger.setAttribute("aria-label", labelText);
      label.id = labelId;
      label.className = "flux-dropdown-label";
      label.textContent = labelText;
      arrow.className = "flux-dropdown-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "▼";
      trigger.appendChild(label);
      trigger.appendChild(arrow);
      panel.id = panelId;
      panel.className = "flux-dropdown-panel flux-native-compact-dropdown-panel";
      panel.setAttribute("role", "listbox");
      panel.setAttribute("aria-label", labelText);
      list.id = listId;
      list.className = "flux-dropdown-list";
      for (i = 0; i < items.length; i += 1) {
        var item = document.createElement("div");
        var itemValue = String(items[i].value);
        item.className = "flux-dropdown-item";
        item.setAttribute("role", "option");
        item.setAttribute("data-value", itemValue);
        item.setAttribute("aria-selected", itemValue === String(selectedValue) ? "true" : "false");
        item.textContent = String(items[i].label);
        if (itemValue === String(selectedValue)) {
          item.classList.add("active");
          selectedFound = true;
          label.textContent = String(items[i].label);
        }
        list.appendChild(item);
      }
      if (!selectedFound && items.length > 0) {
        list.firstChild.classList.add("active");
        list.firstChild.setAttribute("aria-selected", "true");
        label.textContent = list.firstChild.textContent;
      }
      if (items.length === 0) {
        trigger.setAttribute("aria-disabled", "true");
        label.textContent = "No sources loaded";
      } else {
        trigger.removeAttribute("aria-disabled");
      }
      panel.appendChild(list);
      wrapper.appendChild(trigger);
      wrapper.appendChild(panel);
      slot.appendChild(wrapper);
      sdk.ui.bindDropdown({
        wrapper: wrapperId,
        trigger: triggerId,
        panel: panelId,
        itemSelector: ".flux-dropdown-item",
        onSelect: function (item) {
          label.textContent = item.textContent.trim();
          if (onSelect) { onSelect(item.getAttribute("data-value")); }
        }
      });
    }

    function formatValue(value) {
      var rounded = Math.round(Number(value) * 100) / 100;
      return String(rounded);
    }

    function applySettings(settings) {
      var i;
      state.suppressPresetTracking = true;
      for (i = 0; i < numericFieldIds.length; i += 1) {
        var field = byId("sg-" + numericFieldIds[i]);
        if (field) { field.value = formatValue(settings[numericFieldIds[i]]); }
      }
      byId("sg-masterSeed").value = String(settings.masterSeed);
      byId("sg-beam").checked = settings.beam === true;
      byId("sg-accidentals").checked = settings.accidentals === true;
      if (settings.pitchLowText) { setDropdownValue("sg-pitch-low", settings.pitchLowText); }
      if (settings.pitchHighText) { setDropdownValue("sg-pitch-high", settings.pitchHighText); }
      state.activePresetId = settings.presetId || "custom";
      setDropdownValue("sg-preset", state.activePresetId);
      state.suppressPresetTracking = false;
    }

    function readSettings() {
      var settings = {};
      var i;
      for (i = 0; i < numericFieldIds.length; i += 1) {
        var fieldId = numericFieldIds[i];
        settings[fieldId] = byId("sg-" + fieldId).value;
      }
      settings.masterSeed = byId("sg-masterSeed").value;
      settings.beam = byId("sg-beam").checked;
      settings.accidentals = byId("sg-accidentals").checked;
      settings.pitchLowText = getDropdownValue("sg-pitch-low");
      settings.pitchHighText = getDropdownValue("sg-pitch-high");
      settings.presetId = state.activePresetId;
      return settings;
    }

    function setActionStatus(message) {
      var basic = byId("sg-basic-status");
      var advanced = byId("sg-advanced-status");
      if (basic) { basic.textContent = message; }
      if (advanced) { advanced.textContent = message; }
    }

    function setImportStatus(message) {
      var status = byId("sg-import-status");
      if (status) { status.textContent = message; }
    }

    function getErrorMessage(error) {
      return error && error.message ? error.message : String(error);
    }

    function findDataElement(event, attribute) {
      var node = event.target;
      if (node && node.nodeType === 3) { node = node.parentNode; }
      while (node && node !== root) {
        if (node.getAttribute && node.getAttribute(attribute) !== null) { return node; }
        node = node.parentNode;
      }
      return null;
    }

    function setActiveTab(tabName) {
      var buttons = root.querySelectorAll("[data-tab]");
      var panels = root.querySelectorAll(".sg-tab-panel");
      var i;
      for (i = 0; i < buttons.length; i += 1) {
        var active = buttons[i].getAttribute("data-tab") === tabName;
        buttons[i].classList.toggle("active", active);
        buttons[i].setAttribute("aria-selected", active ? "true" : "false");
      }
      for (i = 0; i < panels.length; i += 1) {
        panels[i].hidden = panels[i].id !== "sg-tab-" + tabName;
      }
    }

    function markPresetCustom() {
      if (state.suppressPresetTracking || !state.config) { return; }
      state.activePresetId = "custom";
      setDropdownValue("sg-preset", "custom");
      setActionStatus("Custom selected.");
    }

    function handlePresetSelection(presetId) {
      var previousPresetId = state.activePresetId;
      if (presetId === "custom") {
        state.activePresetId = "custom";
        setActionStatus("Custom selected.");
        return;
      }
      sdk.ae.call("applyPreset", {
        settings: readSettings(),
        presetId: presetId
      }).then(function (settings) {
        applySettings(settings);
        setActionStatus(presetId.charAt(0).toUpperCase() + presetId.substring(1) + " applied. Click Generate.");
      }).catch(function (error) {
        setDropdownValue("sg-preset", previousPresetId);
        state.activePresetId = previousPresetId;
        setActionStatus("Preset not applied: " + getErrorMessage(error));
      });
    }

    function applySourceChoices(document) {
      var items = [];
      var lanes = document && document.lanes ? document.lanes : [];
      var selectedIndex = chooseDefaultLane(document);
      var i;
      var sourceLabel = byId("sg-import-source-label");
      if (sourceLabel) {
        sourceLabel.textContent = !document ? "Source" :
          (document.type === "midi" ? "Track / Channel" : "Part / Staff / Voice");
      }
      for (i = 0; i < lanes.length; i += 1) {
        items.push({ value: String(i), label: lanes[i].name || ("Source " + (i + 1)) });
      }
      state.importLaneIndex = selectedIndex;
      makeDropdown(
        "sg-import-source-slot",
        "sg-import-source",
        "sg-import-source-trigger",
        "sg-import-source-options",
        "sg-import-source-list",
        "sg-import-source-label-value",
        "Import source",
        items,
        selectedIndex >= 0 ? String(selectedIndex) : "",
        function (value) { state.importLaneIndex = parseInt(value, 10); }
      );
    }

    function chooseDefaultLane(document) {
      var lanes = document && document.lanes ? document.lanes : [];
      var bestIndex = -1;
      var bestCount = -1;
      var i;
      var lane;
      var count;
      for (i = 0; i < lanes.length; i += 1) {
        lane = lanes[i];
        if (lane.isPercussion) { continue; }
        count = lane.sourceType === "midi" ? (lane.rawNotes || []).length : (lane.events || []).length;
        if (count > bestCount) {
          bestIndex = i;
          bestCount = count;
        }
      }
      if (bestIndex < 0 && lanes.length > 0) { bestIndex = 0; }
      return bestIndex;
    }

    function summarizeMeter(document) {
      var labels = [];
      var seen = {};
      var source = [];
      var lane;
      var i;
      function addLabel(signature) {
        var label;
        if (!signature || !signature.numerator || !signature.denominator) { return; }
        label = Math.floor(signature.numerator) + "/" + Math.floor(signature.denominator);
        if (!seen[label]) {
          seen[label] = true;
          labels.push(label);
        }
      }
      if (!document) { return ""; }
      if (document.type === "midi") {
        source = document.timeSignatures || [];
        for (i = 0; i < source.length; i += 1) { addLabel(source[i]); }
        if (labels.length === 0) { labels.push("4/4"); }
      } else {
        lane = document.lanes && document.lanes.length ? document.lanes[chooseDefaultLane(document)] : null;
        source = lane && lane.measureSignatures ? lane.measureSignatures : [];
        for (i = 0; i < source.length; i += 1) { addLabel(source[i]); }
      }
      if (labels.length === 0) { return ""; }
      if (labels.length > 4) {
        labels = labels.slice(0, 4);
        labels.push("...");
      }
      return " Meter: " + labels.join(", ");
    }

    function displayImportDocument(document, pathText) {
      if (!document || !document.lanes) { throw new Error("No note source was found in the selected file."); }
      state.importDocument = document;
      state.importPathText = pathText;
      applySourceChoices(document);
      setImportStatus(
        "Loaded " + String(document.type || "score").toUpperCase() + ": " +
        document.lanes.length + " source(s)." + summarizeMeter(document)
      );
    }

    function clearImportDocument(message) {
      state.importDocument = null;
      state.importLaneIndex = -1;
      applySourceChoices(null);
      setImportStatus(message || "Import file not loaded");
    }

    function loadImportPath(pathText) {
      var token = ++state.importLoadToken;
      var value = String(pathText || "").trim();
      if (!value) {
        clearImportDocument("Choose or enter an import file.");
        return Promise.resolve(null);
      }
      setImportStatus("Loading import file...");
      return sdk.ae.call("parseImport", { path: value }).then(function (document) {
        if (token !== state.importLoadToken) { return null; }
        displayImportDocument(document, value);
        return document;
      }).catch(function (error) {
        if (token === state.importLoadToken) {
          clearImportDocument("Could not load import file: " + getErrorMessage(error));
        }
        throw error;
      });
    }

    function chooseImportFile() {
      var token;
      setImportStatus("Choose a MIDI or MusicXML file...");
      return sdk.files.chooseFile({
        title: "Select a MIDI or MusicXML file",
        extensions: ["mid", "midi", "musicxml", "xml"]
      }).then(function (file) {
        if (!file) {
          setImportStatus("Ready");
          return null;
        }
        token = ++state.importLoadToken;
        byId("sg-import-path").value = file.name;
        state.importPathText = "";
        state.importDocument = null;
        setImportStatus("Loading import file...");
        var extension = String(file.name).split(".").pop().toLowerCase();
        var readPromise;
        // 選択ファイルはSDKの読み取りAPIで受け取り、内容をその場でホストへ渡す。
        if (extension === "mid" || extension === "midi") {
          readPromise = file.readFile().then(function (data) {
            return sdk.ae.call("parseImport", {
              name: file.name,
              bytes: Array.prototype.slice.call(data)
            });
          });
        } else {
          readPromise = file.readText().then(function (text) {
            return sdk.ae.call("parseImport", {
              name: file.name,
              text: text
            });
          });
        }
        return readPromise.then(function (document) {
          if (token !== state.importLoadToken) { return null; }
          displayImportDocument(document, file.name);
          return document;
        }).catch(function (error) {
          if (token === state.importLoadToken) {
            clearImportDocument("Could not load import file: " + getErrorMessage(error));
          }
          throw error;
        });
      }).catch(function (error) {
        setImportStatus("Could not load import file: " + getErrorMessage(error));
        return null;
      });
    }

    function importLayoutAdjustmentSummary(original, fitted) {
      var keys = ["length", "staffSize", "noteScale", "symbolScale"];
      var labels = {
        length: "Length",
        staffSize: "Staff Space",
        noteScale: "Note Scale",
        symbolScale: "Symbol Scale"
      };
      var changes = [];
      var i;
      var key;
      for (i = 0; i < keys.length; i += 1) {
        key = keys[i];
        if (original[key] !== fitted[key]) {
          changes.push(labels[key] + " " + formatValue(original[key]) + " -> " + formatValue(fitted[key]));
        }
      }
      return changes.length ? " / Layout adjusted: " + changes.join(", ") : "";
    }

    function resetSettings() {
      if (!state.config) { return; }
      applySettings(state.config.defaults);
      state.activePresetId = "default";
      setActionStatus("Defaults restored. Click Generate.");
    }

    function autoAdjustSettings() {
      setActionStatus("Calculating width...");
      return sdk.ae.call("autoAdjust", readSettings()).then(function (result) {
        applySettings(result.settings);
        var message = result.changes.length ? "Auto Adjust complete. Review values." : "Current settings fit.";
        if (result.settings.numericInputsClamped) { message += " Inputs were clamped."; }
        setActionStatus(message + " Click Generate.");
      }).catch(function (error) {
        setActionStatus("Auto Adjust failed: " + getErrorMessage(error));
      });
    }

    function randomizeSettings() {
      setActionStatus("Finding a fitting random setup...");
      return sdk.ae.call("randomize", readSettings()).then(function (settings) {
        applySettings(settings);
        setActionStatus("Randomize complete. Click Generate.");
      }).catch(function (error) {
        setActionStatus("Randomize failed: " + getErrorMessage(error));
      });
    }

    function generateStaff() {
      setActionStatus("Generating...");
      return sdk.ae.call("generate", readSettings()).then(function (result) {
        var message = "Generated: " + result.measureCount + " measures / 1 Shape Layer";
        if (result.layoutAdjusted) {
          message += " / Density adjusted to " + formatValue(result.effectiveRhythmDensity) + "%";
        }
        setActionStatus(message);
      }).catch(function (error) {
        setActionStatus("Generation failed: " + getErrorMessage(error));
      });
    }

    function importStaff() {
      var pathText = byId("sg-import-path").value;
      var loaded;
      setImportStatus("Importing score...");
      if (state.importDocument && state.importPathText === pathText) {
        loaded = Promise.resolve(state.importDocument);
      } else {
        loaded = loadImportPath(pathText);
      }
      return loaded.then(function (document) {
        var raw;
        if (!document) { return null; }
        raw = readSettings();
        return sdk.ae.call("normalizeSettings", raw).then(function (normalized) {
          if (normalized.errors.length) { throw new Error(normalized.errors.join("\n")); }
          return sdk.ae.call("generateImport", {
            settings: normalized.settings,
            document: document,
            laneIndex: state.importLaneIndex
          }).then(function (result) {
            setImportStatus(
              "Imported: " + result.measureCount + " measures / 1 Shape Layer" +
              importLayoutAdjustmentSummary(normalized.settings, result.settings)
            );
          });
        });
      }).catch(function (error) {
        setImportStatus("Import failed: " + getErrorMessage(error));
      });
    }

    function runAction(action) {
      if (action === "reset") { resetSettings(); return Promise.resolve(); }
      if (action === "auto-adjust") { return autoAdjustSettings(); }
      if (action === "randomize") { return randomizeSettings(); }
      if (action === "generate") { return generateStaff(); }
      if (action === "import") { return importStaff(); }
      if (action === "browse") { return chooseImportFile(); }
      return Promise.resolve();
    }

    sdk.runtime.listen(root, "click", function (event) {
      var tabButton = findDataElement(event, "data-tab");
      var actionButton = findDataElement(event, "data-action");
      if (tabButton) {
        setActiveTab(tabButton.getAttribute("data-tab"));
        return;
      }
      if (actionButton) {
        return runAction(actionButton.getAttribute("data-action"));
      }
    });

    function handleCustomFieldChange(event) {
      var target = event.target;
      var fieldName;
      var i;
      if (!target || !target.id || state.suppressPresetTracking) { return; }
      fieldName = target.id.replace(/^sg-/, "");
      for (i = 0; i < customPresetFields.length; i += 1) {
        if (fieldName === customPresetFields[i]) {
          markPresetCustom();
          return;
        }
      }
    }
    sdk.runtime.listen(root, "input", handleCustomFieldChange);
    sdk.runtime.listen(root, "change", function (event) {
      handleCustomFieldChange(event);
      if (event.target && event.target.id === "sg-import-path") {
        var pathText = byId("sg-import-path").value;
        if (pathText !== state.importPathText) {
          loadImportPath(pathText).catch(function () {});
        }
      }
    });

    makeDropdown(
      "sg-import-source-slot",
      "sg-import-source",
      "sg-import-source-trigger",
      "sg-import-source-options",
      "sg-import-source-list",
      "sg-import-source-label-value",
      "Import source",
      [],
      "",
      function (value) { state.importLaneIndex = parseInt(value, 10); }
    );
    sdk.ae.call("getConfig", null).then(function (config) {
      var presetItems = config.presets.map(function (preset) {
        return { value: preset.id, label: preset.label };
      });
      var pitchItems = config.pitchChoices.map(function (choice) {
        return { value: choice.value, label: choice.label };
      });
      state.config = config;
      makeDropdown(
        "sg-preset-slot",
        "sg-preset",
        "sg-preset-trigger",
        "sg-preset-options",
        "sg-preset-list",
        "sg-preset-label",
        "Preset",
        presetItems,
        config.defaults.presetId,
        handlePresetSelection
      );
      makeDropdown(
        "sg-pitch-low-slot",
        "sg-pitch-low",
        "sg-pitch-low-trigger",
        "sg-pitch-low-options",
        "sg-pitch-low-list",
        "sg-pitch-low-label",
        "Lower pitch",
        pitchItems,
        config.defaults.pitchLowText
      );
      makeDropdown(
        "sg-pitch-high-slot",
        "sg-pitch-high",
        "sg-pitch-high-trigger",
        "sg-pitch-high-options",
        "sg-pitch-high-list",
        "sg-pitch-high-label",
        "Higher pitch",
        pitchItems,
        config.defaults.pitchHighText
      );
      applySettings(config.defaults);
      setActionStatus("Ready");
    }).catch(function (error) {
      setActionStatus("Could not load settings: " + getErrorMessage(error));
    });
  }
};

module.exports = tool;
