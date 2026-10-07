// Nettoyage Nordique MTL — invoice tool.
// Everything is stored in this browser's localStorage (no server). Business details are entered
// in Réglages on her device, so nothing personal lives in the public site files.
(function () {
  'use strict';

  var KEYS = { settings: 'nn-fact-settings', clients: 'nn-fact-clients', invoices: 'nn-fact-invoices', lang: 'nn-fact-lang' };

  var DEFAULT_SETTINGS = {
    bizName: 'Nettoyage Nordique MTL',
    bizAddress: '',
    bizPhone: '',
    bizEmail: 'info@nettoyagenordique.com',
    website: 'nettoyagenordique.com',
    payPhone: '',
    payEmail: '',
    nextNumber: 4,
    defaultAmount: '',
    defaultDescription: 'Cleaning Services / Services de nettoyage',
    gmailAccount: 'alicia@nettoyagenordique.com',
    taxRegistered: false,
    gstNo: '',
    qstNo: ''
  };

  var GST = 0.05, QST = 0.09975;

  var I18N = {
    fr: {
      appTitle: 'Factures', tabNew: 'Nouvelle facture', tabHistory: 'Historique', tabSettings: 'Réglages',
      setupNotice: 'Avant la première facture, remplissez vos informations dans Réglages.', openSettings: 'Ouvrir les réglages',
      client: 'Client', chooseClient: 'Client existant', newClient: '+ Nouveau client', clientName: 'Nom', clientEmail: 'Courriel',
      clientAddress: 'Adresse', clientLang: 'Langue du courriel et des dates', langFr: 'Français', langEn: 'Anglais',
      invoice: 'Facture', number: 'Numéro', issueDate: "Date d'émission", serviceDate: 'Date du service',
      services: 'Services', description: 'Description', amount: 'Montant ($)', addLine: '+ Ajouter une ligne', removeLine: 'Retirer la ligne',
      note: 'Note sur la facture (facultatif)', subtotal: 'Sous-total', taxes: 'Taxes', gst: 'TPS (5 %)', qst: 'TVQ (9,975 %)', total: 'Total',
      preview: 'Aperçu PDF', send: 'Envoyer la facture',
      filterAll: 'Toutes', filterUnpaid: 'Impayées', filterPaid: 'Payées', historyEmpty: "Aucune facture pour l'instant.",
      statUnpaid: 'À recevoir', statPaidYear: 'Payé cette année', statCount: 'Factures cette année',
      paid: 'Payée', unpaid: 'Impayée', markPaid: 'Marquer payée', markUnpaid: 'Marquer impayée',
      pdf: 'PDF', resend: 'Renvoyer', duplicate: 'Dupliquer', del: 'Supprimer', confirmDelete: 'Supprimer la facture no {n}?',
      bizInfo: 'Votre entreprise', bizName: "Nom de l'entreprise", bizAddress: 'Adresse', bizPhone: 'Téléphone', bizEmail: 'Courriel', website: 'Site web',
      payment: 'Paiement (virement Interac)', payPhone: 'Téléphone pour virement', payEmail: 'Courriel pour virement',
      invoiceDefaults: 'Factures', nextNumber: 'Prochain numéro', defaultAmount: 'Montant habituel ($)', defaultDescription: 'Description par défaut',
      gmailAccount: 'Compte Gmail pour envoyer', taxRegistered: 'Inscrite aux taxes (facturer TPS 5 % et TVQ 9,975 %)', gstNo: 'No TPS', qstNo: 'No TVQ',
      saveSettings: 'Enregistrer', settingsSaved: 'Réglages enregistrés.',
      backup: 'Sauvegarde', backupHint: 'Les factures sont gardées sur cet appareil seulement. Exportez une sauvegarde de temps en temps, ou pour passer à un autre appareil.',
      exportCsv: 'Exporter (CSV pour la comptabilité)', exportBackup: 'Exporter une sauvegarde', importBackup: 'Importer une sauvegarde',
      importConfirm: 'Remplacer les réglages, clients et factures de cet appareil par la sauvegarde?', importDone: 'Sauvegarde importée.', importError: 'Ce fichier ne semble pas être une sauvegarde valide.',
      needName: 'Ajoutez le nom du client.', needLine: 'Ajoutez au moins un service avec un montant.', needNumber: 'Ajoutez un numéro de facture.',
      numberUsed: 'La facture no {n} existe déjà. Elle sera remplacée. Continuer?',
      pdfError: "Impossible de créer le PDF (vérifiez la connexion Internet et réessayez).", storageError: "Impossible d'enregistrer sur cet appareil.",
      attachHint: 'PDF téléchargé. Glissez-le dans le courriel Gmail qui vient de s’ouvrir.', sharedHint: 'Facture enregistrée.'
    },
    en: {
      appTitle: 'Invoices', tabNew: 'New invoice', tabHistory: 'History', tabSettings: 'Settings',
      setupNotice: 'Before your first invoice, fill in your details in Settings.', openSettings: 'Open settings',
      client: 'Client', chooseClient: 'Saved client', newClient: '+ New client', clientName: 'Name', clientEmail: 'Email',
      clientAddress: 'Address', clientLang: 'Language for email and dates', langFr: 'French', langEn: 'English',
      invoice: 'Invoice', number: 'Number', issueDate: 'Date issued', serviceDate: 'Service date',
      services: 'Services', description: 'Description', amount: 'Amount ($)', addLine: '+ Add a line', removeLine: 'Remove line',
      note: 'Note on the invoice (optional)', subtotal: 'Subtotal', taxes: 'Taxes', gst: 'GST (5%)', qst: 'QST (9.975%)', total: 'Total',
      preview: 'Preview PDF', send: 'Send invoice',
      filterAll: 'All', filterUnpaid: 'Unpaid', filterPaid: 'Paid', historyEmpty: 'No invoices yet.',
      statUnpaid: 'Outstanding', statPaidYear: 'Paid this year', statCount: 'Invoices this year',
      paid: 'Paid', unpaid: 'Unpaid', markPaid: 'Mark paid', markUnpaid: 'Mark unpaid',
      pdf: 'PDF', resend: 'Resend', duplicate: 'Duplicate', del: 'Delete', confirmDelete: 'Delete invoice #{n}?',
      bizInfo: 'Your business', bizName: 'Business name', bizAddress: 'Address', bizPhone: 'Phone', bizEmail: 'Email', website: 'Website',
      payment: 'Payment (Interac e-Transfer)', payPhone: 'Phone for e-Transfer', payEmail: 'Email for e-Transfer',
      invoiceDefaults: 'Invoices', nextNumber: 'Next number', defaultAmount: 'Usual amount ($)', defaultDescription: 'Default description',
      gmailAccount: 'Gmail account to send from', taxRegistered: 'Registered for taxes (charge GST 5% and QST 9.975%)', gstNo: 'GST no.', qstNo: 'QST no.',
      saveSettings: 'Save', settingsSaved: 'Settings saved.',
      backup: 'Backup', backupHint: 'Invoices are stored on this device only. Export a backup now and then, or to move to another device.',
      exportCsv: 'Export (CSV for bookkeeping)', exportBackup: 'Export a backup', importBackup: 'Import a backup',
      importConfirm: "Replace this device's settings, clients and invoices with the backup?", importDone: 'Backup imported.', importError: "This file doesn't look like a valid backup.",
      needName: "Add the client's name.", needLine: 'Add at least one service with an amount.', needNumber: 'Add an invoice number.',
      numberUsed: 'Invoice #{n} already exists and will be replaced. Continue?',
      pdfError: "Couldn't create the PDF (check the internet connection and try again).", storageError: "Couldn't save on this device.",
      attachHint: 'PDF downloaded. Drag it into the Gmail draft that just opened.', sharedHint: 'Invoice saved.'
    }
  };

  // ---------- Storage ----------

  function load(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (e) { toast(t('storageError')); return false; }
  }

  var settings = Object.assign({}, DEFAULT_SETTINGS, load(KEYS.settings, {}));
  var clients = load(KEYS.clients, []);
  var invoices = load(KEYS.invoices, []);
  var uiLang = load(KEYS.lang, 'fr') === 'en' ? 'en' : 'fr';
  var historyFilter = 'all';
  var logoData = null;

  // ---------- Helpers ----------

  var $ = function (id) { return document.getElementById(id); };

  function t(key, vars) {
    var s = (I18N[uiLang] && I18N[uiLang][key]) || I18N.fr[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.replace('{' + k + '}', vars[k]); });
    return s;
  }

  function round2(n) { return Math.round((Number(n) || 0) * 100) / 100; }

  function money(n, lang) {
    return new Intl.NumberFormat(lang === 'en' ? 'en-CA' : 'fr-CA', { style: 'currency', currency: 'CAD' })
      .format(round2(n)).replace(/[  ]/g, ' ');
  }

  function todayIso() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function longDate(iso, lang) {
    if (!iso) return '';
    var p = iso.split('-');
    var d = new Date(+p[0], +p[1] - 1, +p[2]);
    return d.toLocaleDateString(lang === 'en' ? 'en-CA' : 'fr-CA', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  function computeTotals(lines, taxed) {
    var subtotal = round2(lines.reduce(function (s, l) { return s + (Number(l.amount) || 0); }, 0));
    var gst = taxed ? round2(subtotal * GST) : 0;
    var qst = taxed ? round2(subtotal * QST) : 0;
    return { subtotal: subtotal, gst: gst, qst: qst, total: round2(subtotal + gst + qst) };
  }

  var toastTimer;
  function toast(msg) {
    var el = $('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 4200);
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function downloadBlob(blob, name) {
    var url = URL.createObjectURL(blob);
    var a = el('a', { href: url, download: name });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 10000);
  }

  function slug(s) {
    return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
  }

  function isSetUp() { return !!(settings.bizAddress && (settings.payPhone || settings.payEmail)); }

  // ---------- Language ----------

  function applyI18n() {
    document.documentElement.lang = uiLang === 'en' ? 'en-CA' : 'fr-CA';
    document.title = t('appTitle') + ' | Nettoyage Nordique MTL';
    document.querySelectorAll('[data-i18n]').forEach(function (node) { node.textContent = t(node.getAttribute('data-i18n')); });
    $('langBtn').textContent = uiLang === 'en' ? 'FR' : 'EN';
    renderClientSelect();
    renderLinesLabels();
    renderTotals();
    renderHistory();
  }

  // ---------- Tabs ----------

  function showTab(name) {
    document.querySelectorAll('.tabs [role="tab"]').forEach(function (b) {
      var on = b.getAttribute('data-tab') === name;
      b.setAttribute('aria-selected', on ? 'true' : 'false');
      $('tab-' + b.getAttribute('data-tab')).hidden = !on;
    });
    if (name === 'history') renderHistory();
    if (name === 'settings') fillSettingsForm();
    window.scrollTo(0, 0);
  }

  // ---------- Clients ----------

  function renderClientSelect() {
    var sel = $('clientSelect');
    var current = sel.value;
    sel.innerHTML = '';
    sel.appendChild(el('option', { value: '' }, t('newClient')));
    clients.slice().sort(function (a, b) { return a.name.localeCompare(b.name); }).forEach(function (c) {
      sel.appendChild(el('option', { value: c.name }, c.name));
    });
    sel.value = current;
  }

  function upsertClient(c) {
    var key = c.name.trim().toLowerCase();
    var i = clients.findIndex(function (x) { return x.name.trim().toLowerCase() === key; });
    var rec = { name: c.name.trim(), email: c.email || '', address: c.address || '', lang: c.lang || 'fr' };
    if (i >= 0) clients[i] = rec; else clients.push(rec);
    save(KEYS.clients, clients);
  }

  // ---------- Invoice form ----------

  function addLine(desc, amount) {
    var row = el('div', { class: 'line' });
    var f1 = el('label', { class: 'field' });
    f1.appendChild(el('span', { 'data-role': 'desc-label' }, t('description')));
    var d = el('input', { type: 'text', 'data-role': 'desc', autocomplete: 'off' });
    d.value = desc != null ? desc : settings.defaultDescription;
    f1.appendChild(d);
    var f2 = el('label', { class: 'field' });
    f2.appendChild(el('span', { 'data-role': 'amount-label' }, t('amount')));
    var a = el('input', { type: 'number', min: '0', step: '0.01', inputmode: 'decimal', 'data-role': 'amount' });
    a.value = amount != null && amount !== '' ? amount : (settings.defaultAmount || '');
    f2.appendChild(a);
    var rm = el('button', { type: 'button', class: 'remove', 'aria-label': t('removeLine'), title: t('removeLine') }, '×');
    rm.addEventListener('click', function () {
      if (document.querySelectorAll('#lines .line').length > 1) row.remove();
      else { d.value = ''; a.value = ''; }
      renderTotals();
    });
    row.appendChild(f1); row.appendChild(f2); row.appendChild(rm);
    $('lines').appendChild(row);
    d.addEventListener('input', renderTotals);
    a.addEventListener('input', renderTotals);
    renderTotals();
  }

  function renderLinesLabels() {
    document.querySelectorAll('[data-role="desc-label"]').forEach(function (n) { n.textContent = t('description'); });
    document.querySelectorAll('[data-role="amount-label"]').forEach(function (n) { n.textContent = t('amount'); });
    document.querySelectorAll('#lines .remove').forEach(function (n) { n.setAttribute('aria-label', t('removeLine')); n.title = t('removeLine'); });
  }

  function readLines() {
    return Array.prototype.map.call(document.querySelectorAll('#lines .line'), function (row) {
      return {
        desc: row.querySelector('[data-role="desc"]').value.trim(),
        amount: round2(row.querySelector('[data-role="amount"]').value)
      };
    }).filter(function (l) { return l.desc || l.amount; });
  }

  function renderTotals() {
    var box = $('totals');
    if (!box) return;
    var tot = computeTotals(readLines(), settings.taxRegistered);
    box.innerHTML = '';
    function row(label, value, grand) {
      box.appendChild(el('dt', grand ? { class: 'grand' } : null, label));
      box.appendChild(el('dd', grand ? { class: 'grand' } : null, money(value, uiLang)));
    }
    if (settings.taxRegistered) {
      row(t('subtotal'), tot.subtotal);
      row(t('gst'), tot.gst);
      row(t('qst'), tot.qst);
    } else {
      row(t('taxes'), 0);
    }
    row(t('total'), tot.total, true);
  }

  function resetForm(keepClient) {
    if (!keepClient) {
      $('clientSelect').value = '';
      $('clientName').value = '';
      $('clientEmail').value = '';
      $('clientAddress').value = '';
      $('clientLang').value = 'fr';
    }
    $('invNumber').value = settings.nextNumber;
    $('issueDate').value = todayIso();
    $('serviceDate').value = todayIso();
    $('invNote').value = '';
    $('lines').innerHTML = '';
    addLine();
    $('setupNotice').hidden = isSetUp();
  }

  function collectInvoice() {
    var name = $('clientName').value.trim();
    var number = parseInt($('invNumber').value, 10);
    var lines = readLines();
    [$('clientName'), $('invNumber')].forEach(function (i) { i.removeAttribute('aria-invalid'); });
    if (!name) { $('clientName').setAttribute('aria-invalid', 'true'); $('clientName').focus(); toast(t('needName')); return null; }
    if (!number || number < 1) { $('invNumber').setAttribute('aria-invalid', 'true'); $('invNumber').focus(); toast(t('needNumber')); return null; }
    if (!lines.length || !lines.some(function (l) { return l.amount > 0; })) { toast(t('needLine')); return null; }
    var taxed = !!settings.taxRegistered;
    var tot = computeTotals(lines, taxed);
    return {
      number: number,
      issueDate: $('issueDate').value || todayIso(),
      serviceDate: $('serviceDate').value || $('issueDate').value || todayIso(),
      lang: $('clientLang').value === 'en' ? 'en' : 'fr',
      client: { name: name, email: $('clientEmail').value.trim(), address: $('clientAddress').value.trim() },
      lines: lines,
      note: $('invNote').value.trim(),
      taxed: taxed,
      subtotal: tot.subtotal, gst: tot.gst, qst: tot.qst, total: tot.total,
      biz: {
        name: settings.bizName, address: settings.bizAddress, phone: settings.bizPhone, email: settings.bizEmail,
        website: settings.website, payPhone: settings.payPhone, payEmail: settings.payEmail,
        gstNo: settings.gstNo, qstNo: settings.qstNo
      },
      status: 'unpaid'
    };
  }

  // ---------- PDF ----------

  function loadLogo() {
    fetch('/facture/invoice-logo.png')
      .then(function (r) { return r.blob(); })
      .then(function (blob) {
        var fr = new FileReader();
        fr.onload = function () { logoData = fr.result; };
        fr.readAsDataURL(blob);
      })
      .catch(function () { logoData = null; });
  }

  function buildPdf(inv) {
    var JsPDF = window.jspdf && window.jspdf.jsPDF;
    if (!JsPDF) throw new Error('jsPDF missing');
    var doc = new JsPDF({ unit: 'pt', format: 'letter', compress: true });
    var b = inv.biz, lang = inv.lang;
    var W = 612, M = 56, R = W - M;
    var PINK = [233, 57, 113], INK = [31, 31, 31], MUTED = [110, 90, 98], LINE = [240, 217, 225], SOFT = [249, 234, 241];
    function ink(c) { doc.setTextColor(c[0], c[1], c[2]); }
    function font(style, size) { doc.setFont('helvetica', style); doc.setFontSize(size); }
    function label(text, x, y, align) { font('bold', 7.5); ink(PINK); doc.setCharSpace(0.6); doc.text(text, x, y, align ? { align: align } : undefined); doc.setCharSpace(0); }
    function lines(text) { return String(text || '').split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean); }

    doc.setProperties({ title: 'Facture ' + inv.number + ' - ' + b.name, author: b.name });

    // Logo and title
    if (logoData) doc.addImage(logoData, 'PNG', (W - 124) / 2, 34, 124, 107, 'logo', 'FAST');
    var y = 170;
    font('bold', 19); ink(INK);
    doc.text('INVOICE / FACTURE', W / 2, y, { align: 'center' });
    doc.setDrawColor(PINK[0], PINK[1], PINK[2]); doc.setLineWidth(1.4);
    doc.line(W / 2 - 34, y + 10, W / 2 + 34, y + 10);

    // From (left) and invoice details (right)
    y = 214;
    label('FROM / DE', M, y);
    var ly = y + 16;
    font('bold', 10.5); ink(INK); doc.text(b.name || '', M, ly); ly += 14;
    font('normal', 9.5); ink(MUTED);
    lines(b.address).concat([b.phone, b.email].filter(Boolean)).forEach(function (s) { doc.text(s, M, ly); ly += 13; });

    label('INVOICE NO / FACTURE NO', R, y, 'right');
    font('bold', 16); ink(INK); doc.text(String(inv.number), R, y + 20, { align: 'right' });
    font('normal', 8); ink(MUTED); doc.text("Date issued / Date d'émission", R, y + 40, { align: 'right' });
    font('bold', 10); ink(INK); doc.text(longDate(inv.issueDate, lang), R, y + 53, { align: 'right' });
    font('normal', 8); ink(MUTED); doc.text('Service date / Date du service', R, y + 70, { align: 'right' });
    font('bold', 10); ink(INK); doc.text(longDate(inv.serviceDate, lang), R, y + 83, { align: 'right' });

    // Bill to
    y = Math.max(ly, y + 92) + 14;
    label('BILL TO / FACTURÉ À', M, y);
    var by = y + 16;
    font('bold', 10.5); ink(INK); doc.text(inv.client.name, M, by); by += 14;
    font('normal', 9.5); ink(MUTED);
    lines(inv.client.address).concat(inv.client.email ? [inv.client.email] : []).forEach(function (s) { doc.text(s, M, by); by += 13; });

    // Table
    y = by + 18;
    var amountW = 124, descW = R - M - amountW, top = y;
    doc.setFillColor(PINK[0], PINK[1], PINK[2]);
    doc.rect(M, y, R - M, 24, 'F');
    font('bold', 9.5); ink([255, 255, 255]);
    doc.text('Description / Description', M + 12, y + 16);
    doc.text('Amount / Montant', R - 12, y + 16, { align: 'right' });
    y += 24;

    var BOTTOM = 728; // keep clear of the page footer
    doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.8);
    function tableRow(left, right, opts) {
      opts = opts || {};
      font(opts.bold ? 'bold' : 'normal', opts.size || 9.5);
      var wrapped = doc.splitTextToSize(left, descW - 24);
      var h = Math.max(26, wrapped.length * 12 + 14);
      if (y + h > BOTTOM) {
        doc.setDrawColor(LINE[0], LINE[1], LINE[2]);
        doc.rect(M, top, R - M, y - top);
        doc.addPage();
        y = 56; top = y;
        font(opts.bold ? 'bold' : 'normal', opts.size || 9.5);
      }
      if (opts.fill) { doc.setFillColor(opts.fill[0], opts.fill[1], opts.fill[2]); doc.rect(M, y, R - M, h, 'F'); }
      ink(INK);
      doc.text(wrapped, M + 12, y + 17);
      doc.text(right, R - 12, y + 17, { align: 'right' });
      doc.line(M, y + h, R, y + h);
      doc.line(R - amountW, y, R - amountW, y + h);
      y += h;
    }
    inv.lines.forEach(function (l) { tableRow(l.desc || '-', money(l.amount, lang)); });
    if (inv.taxed) {
      tableRow('Subtotal / Sous-total', money(inv.subtotal, lang));
      tableRow('GST / TPS (5 %)', money(inv.gst, lang));
      tableRow('QST / TVQ (9,975 %)', money(inv.qst, lang));
    } else {
      tableRow('Taxes / Taxes', money(0, lang));
    }
    tableRow('TOTAL DUE / TOTAL À PAYER', money(inv.total, lang), { bold: true, size: 10.5, fill: SOFT });
    doc.rect(M, top, R - M, y - top);

    // Note
    if (inv.note) {
      font('italic', 9.5);
      var noteLines = doc.splitTextToSize(inv.note, R - M);
      if (y + 18 + noteLines.length * 12 > BOTTOM) { doc.addPage(); y = 38; }
      y += 18;
      ink(MUTED);
      doc.text(noteLines, M, y);
      y += noteLines.length * 12;
    }

    // Terms and payment. Uses tighter spacing when room is short, and only
    // moves to a new page if even the compact version would hit the footer.
    var pay = [b.payPhone, b.payEmail].filter(Boolean);
    var showTaxNos = inv.taxed && (b.gstNo || b.qstNo);
    function termsGaps(compact) {
      return compact
        ? { top: 22, divider: false, due: 0, payLabel: 18, payValue: 13, taxNos: 15, thanks: 17 }
        : { top: 30, divider: true, due: 20, payLabel: 24, payValue: 14, taxNos: 18, thanks: 24 };
    }
    function termsHeight(g) {
      return g.top + g.due + 14 + (pay.length ? g.payLabel + g.payValue : 0) + (showTaxNos ? g.taxNos : 0) + g.thanks + 4;
    }
    var g = termsGaps(false);
    if (y + termsHeight(g) > BOTTOM) {
      g = termsGaps(true);
      if (y + termsHeight(g) > BOTTOM) { doc.addPage(); y = 40; g = termsGaps(false); }
    }
    y += g.top;
    if (g.divider) {
      doc.setDrawColor(PINK[0], PINK[1], PINK[2]); doc.setLineWidth(0.8);
      doc.line(W / 2 - 80, y, W / 2 - 10, y);
      doc.line(W / 2 + 10, y, W / 2 + 80, y);
      doc.setFillColor(PINK[0], PINK[1], PINK[2]);
      doc.circle(W / 2, y, 2.2, 'F');
    }
    y += g.due;
    font('bold', 10.5); ink(PINK); doc.text('Due upon receipt of the invoice.', W / 2, y, { align: 'center' });
    y += 14;
    font('italic', 10.5); doc.text('Paiement dû dès réception de la facture.', W / 2, y, { align: 'center' });

    if (pay.length) {
      y += g.payLabel;
      font('normal', 9); ink(MUTED);
      doc.text('Payment by Interac e-Transfer / Paiement par virement Interac', W / 2, y, { align: 'center' });
      y += g.payValue;
      font('bold', 10); ink(INK);
      doc.text(pay.join('  ·  '), W / 2, y, { align: 'center' });
    }
    if (showTaxNos) {
      y += g.taxNos;
      font('normal', 8.5); ink(MUTED);
      doc.text(['GST / TPS : ' + (b.gstNo || '-'), 'QST / TVQ : ' + (b.qstNo || '-')].join('     '), W / 2, y, { align: 'center' });
    }
    y += g.thanks;
    font('bold', 10); ink(PINK);
    doc.text('Merci! · Thank you!', W / 2, y, { align: 'center' });

    // Page footer on every page
    var pages = doc.getNumberOfPages();
    for (var p = 1; p <= pages; p++) {
      doc.setPage(p);
      doc.setDrawColor(LINE[0], LINE[1], LINE[2]); doc.setLineWidth(0.8);
      doc.line(M, 746, R, 746);
      font('normal', 8.5); ink(MUTED);
      doc.text([b.website, b.email, b.phone].filter(Boolean).join('   ·   '), W / 2, 762, { align: 'center' });
      if (pages > 1) doc.text(p + ' / ' + pages, R, 762, { align: 'right' });
    }

    return doc;
  }

  function pdfName(inv) {
    return 'Facture-' + inv.number + '-' + (slug(inv.client.name) || 'client') + '.pdf';
  }

  function makePdfBlob(inv) {
    try { return buildPdf(inv).output('blob'); }
    catch (e) { toast(t('pdfError')); return null; }
  }

  // ---------- Email ----------

  function emailText(inv) {
    var b = inv.biz, en = inv.lang === 'en';
    var first = inv.client.name.split(/\s+/)[0];
    var when = longDate(inv.serviceDate, inv.lang);
    var total = money(inv.total, inv.lang);
    var subject = en ? 'Invoice #' + inv.number + ' – ' + b.name : 'Facture no ' + inv.number + ' – ' + b.name;
    var pay = '';
    if (b.payPhone && b.payEmail) pay = en ? 'to ' + b.payPhone + ' or ' + b.payEmail : 'au ' + b.payPhone + ' ou à ' + b.payEmail;
    else if (b.payPhone) pay = (en ? 'to ' : 'au ') + b.payPhone;
    else if (b.payEmail) pay = (en ? 'to ' : 'à ') + b.payEmail;
    var body = en
      ? ['Hello ' + first + ',', '',
         'Please find attached your invoice #' + inv.number + ' for the cleaning services provided on ' + when + '.', '',
         'Total due: ' + total,
         pay ? 'Payment can be made by Interac e-Transfer ' + pay + '.' : '', '',
         'Thank you!']
      : ['Bonjour ' + first + ',', '',
         'Vous trouverez ci-joint votre facture no ' + inv.number + ' pour les services de nettoyage effectués le ' + when + '.', '',
         'Total à payer : ' + total,
         pay ? 'Le paiement peut être fait par virement Interac ' + pay + '.' : '', '',
         'Merci!'];
    return { subject: subject, body: body.filter(function (l, i, arr) { return l !== '' || arr[i - 1] !== ''; }).join('\n') };
  }

  function gmailUrl(to, subject, body) {
    var q = [];
    if (settings.gmailAccount) q.push('authuser=' + encodeURIComponent(settings.gmailAccount));
    q.push('view=cm', 'fs=1', 'to=' + encodeURIComponent(to || ''), 'su=' + encodeURIComponent(subject), 'body=' + encodeURIComponent(body));
    return 'https://mail.google.com/mail/?' + q.join('&');
  }

  function isPhone() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  // Sends one invoice: share sheet with the PDF on phones; download + Gmail draft on computers.
  function deliver(inv) {
    var blob = makePdfBlob(inv);
    if (!blob) return false;
    var name = pdfName(inv);
    var msg = emailText(inv);
    var file = null;
    try { file = new File([blob], name, { type: 'application/pdf' }); } catch (e) { file = null; }

    if (file && isPhone() && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: msg.subject, text: msg.body }).catch(function () {});
      toast(t('sharedHint'));
      return true;
    }
    downloadBlob(blob, name);
    window.open(gmailUrl(inv.client.email, msg.subject, msg.body), '_blank', 'noopener');
    toast(t('attachHint'));
    return true;
  }

  function recordInvoice(inv) {
    var i = invoices.findIndex(function (x) { return x.number === inv.number; });
    var prev = i >= 0 ? invoices[i] : null;
    inv.id = prev ? prev.id : String(Date.now());
    inv.status = prev ? prev.status : 'unpaid';
    inv.paidAt = prev ? prev.paidAt : null;
    inv.sentAt = new Date().toISOString();
    if (i >= 0) invoices[i] = inv; else invoices.push(inv);
    save(KEYS.invoices, invoices);
    upsertClient({ name: inv.client.name, email: inv.client.email, address: inv.client.address, lang: inv.lang });
    if (inv.number >= settings.nextNumber) { settings.nextNumber = inv.number + 1; save(KEYS.settings, settings); }
    renderClientSelect();
  }

  // ---------- History ----------

  function renderHistory() {
    var list = $('historyList');
    if (!list) return;
    var year = String(new Date().getFullYear());
    var unpaid = 0, paidYear = 0, countYear = 0;
    invoices.forEach(function (inv) {
      if (inv.status !== 'paid') unpaid += inv.total;
      if ((inv.issueDate || '').slice(0, 4) === year) { countYear++; if (inv.status === 'paid') paidYear += inv.total; }
    });
    var summary = $('summary');
    summary.innerHTML = '';
    [[money(unpaid, uiLang), t('statUnpaid')], [money(paidYear, uiLang), t('statPaidYear')], [String(countYear), t('statCount')]].forEach(function (s) {
      var box = el('div', { class: 'stat' });
      box.appendChild(el('b', null, s[0]));
      box.appendChild(el('span', null, s[1]));
      summary.appendChild(box);
    });

    var shown = invoices.slice().sort(function (a, b) { return b.number - a.number; }).filter(function (inv) {
      return historyFilter === 'all' || (historyFilter === 'paid' ? inv.status === 'paid' : inv.status !== 'paid');
    });
    list.innerHTML = '';
    $('historyEmpty').hidden = shown.length > 0;
    shown.forEach(function (inv) {
      var li = el('li', { class: 'inv' });
      var top = el('div', { class: 'inv-top' });
      top.appendChild(el('strong', null, '#' + inv.number + ' · ' + inv.client.name));
      top.appendChild(el('span', { class: 'inv-total' }, money(inv.total, uiLang)));
      li.appendChild(top);
      li.appendChild(el('p', { class: 'inv-meta' }, longDate(inv.issueDate, uiLang) + (inv.client.email ? ' · ' + inv.client.email : '')));

      var actions = el('div', { class: 'inv-actions' });
      var paid = inv.status === 'paid';
      actions.appendChild(el('span', { class: 'status' + (paid ? ' paid' : '') }, paid ? t('paid') : t('unpaid')));
      function action(label, fn) {
        var btn = el('button', { type: 'button', class: 'btn btn-ghost btn-small' }, label);
        btn.addEventListener('click', fn);
        actions.appendChild(btn);
      }
      action(paid ? t('markUnpaid') : t('markPaid'), function () {
        inv.status = paid ? 'unpaid' : 'paid';
        inv.paidAt = paid ? null : new Date().toISOString();
        save(KEYS.invoices, invoices);
        renderHistory();
      });
      action(t('pdf'), function () { var blob = makePdfBlob(inv); if (blob) downloadBlob(blob, pdfName(inv)); });
      action(t('resend'), function () { if (deliver(inv)) { inv.sentAt = new Date().toISOString(); save(KEYS.invoices, invoices); } });
      action(t('duplicate'), function () { duplicate(inv); });
      action(t('del'), function () {
        if (!window.confirm(t('confirmDelete', { n: inv.number }))) return;
        invoices = invoices.filter(function (x) { return x !== inv; });
        save(KEYS.invoices, invoices);
        renderHistory();
      });
      li.appendChild(actions);
      list.appendChild(li);
    });
  }

  function duplicate(inv) {
    $('clientSelect').value = clients.some(function (c) { return c.name === inv.client.name; }) ? inv.client.name : '';
    $('clientName').value = inv.client.name;
    $('clientEmail').value = inv.client.email || '';
    $('clientAddress').value = inv.client.address || '';
    $('clientLang').value = inv.lang;
    $('invNumber').value = settings.nextNumber;
    $('issueDate').value = todayIso();
    $('serviceDate').value = todayIso();
    $('invNote').value = inv.note || '';
    $('lines').innerHTML = '';
    inv.lines.forEach(function (l) { addLine(l.desc, l.amount); });
    showTab('new');
  }

  // ---------- Settings ----------

  function fillSettingsForm() {
    var f = $('settingsForm');
    Object.keys(DEFAULT_SETTINGS).forEach(function (k) {
      var input = f.elements[k];
      if (!input) return;
      if (input.type === 'checkbox') input.checked = !!settings[k];
      else input.value = settings[k] == null ? '' : settings[k];
    });
    f.classList.toggle('tax-on', !!settings.taxRegistered);
  }

  function saveSettingsForm(e) {
    e.preventDefault();
    var f = $('settingsForm');
    Object.keys(DEFAULT_SETTINGS).forEach(function (k) {
      var input = f.elements[k];
      if (!input) return;
      if (input.type === 'checkbox') settings[k] = input.checked;
      else if (k === 'nextNumber') settings[k] = Math.max(1, parseInt(input.value, 10) || 1);
      else settings[k] = input.value.trim();
    });
    if (save(KEYS.settings, settings)) toast(t('settingsSaved'));
    // Refresh an untouched invoice form so new defaults (amount, description) show up
    if (!readLines().some(function (l) { return l.amount > 0; })) { $('lines').innerHTML = ''; addLine(); }
    $('invNumber').value = settings.nextNumber;
    $('setupNotice').hidden = isSetUp();
    renderTotals();
  }

  // ---------- Export / import ----------

  function csvCell(v) {
    var s = v == null ? '' : String(v);
    return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCsv() {
    var head = ['number', 'issue_date', 'service_date', 'client', 'client_email', 'subtotal', 'gst', 'qst', 'total', 'status', 'paid_at'];
    var rows = invoices.slice().sort(function (a, b) { return a.number - b.number; }).map(function (i) {
      return [i.number, i.issueDate, i.serviceDate, i.client.name, i.client.email, i.subtotal.toFixed(2), i.gst.toFixed(2), i.qst.toFixed(2), i.total.toFixed(2), i.status, (i.paidAt || '').slice(0, 10)];
    });
    var csv = '﻿' + [head].concat(rows).map(function (r) { return r.map(csvCell).join(','); }).join('\r\n');
    downloadBlob(new Blob([csv], { type: 'text/csv;charset=utf-8' }), 'factures-' + todayIso() + '.csv');
  }

  function exportBackup() {
    var data = { app: 'nn-factures', version: 1, exportedAt: new Date().toISOString(), settings: settings, clients: clients, invoices: invoices };
    downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), 'factures-sauvegarde-' + todayIso() + '.json');
  }

  function importBackup(e) {
    var file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var data;
      try { data = JSON.parse(reader.result); } catch (err) { data = null; }
      if (!data || data.app !== 'nn-factures' || !Array.isArray(data.invoices)) { toast(t('importError')); return; }
      if (!window.confirm(t('importConfirm'))) return;
      settings = Object.assign({}, DEFAULT_SETTINGS, data.settings || {});
      clients = Array.isArray(data.clients) ? data.clients : [];
      invoices = data.invoices;
      save(KEYS.settings, settings); save(KEYS.clients, clients); save(KEYS.invoices, invoices);
      fillSettingsForm();
      renderClientSelect();
      resetForm(false);
      renderHistory();
      toast(t('importDone'));
    };
    reader.readAsText(file);
  }

  // ---------- Wire up ----------

  function init() {
    loadLogo();

    document.querySelectorAll('.tabs [role="tab"]').forEach(function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    });
    document.querySelectorAll('[data-goto]').forEach(function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-goto')); });
    });

    $('langBtn').addEventListener('click', function () {
      uiLang = uiLang === 'en' ? 'fr' : 'en';
      save(KEYS.lang, uiLang);
      applyI18n();
    });

    $('clientSelect').addEventListener('change', function () {
      var c = clients.find(function (x) { return x.name === $('clientSelect').value; });
      $('clientName').value = c ? c.name : '';
      $('clientEmail').value = c ? c.email : '';
      $('clientAddress').value = c ? c.address : '';
      $('clientLang').value = c ? c.lang : 'fr';
      if (!c) $('clientName').focus();
    });

    $('addLine').addEventListener('click', function () { addLine('', ''); });

    $('previewBtn').addEventListener('click', function () {
      var inv = collectInvoice();
      if (!inv) return;
      var blob = makePdfBlob(inv);
      if (!blob) return;
      var url = URL.createObjectURL(blob);
      var win = window.open(url, '_blank');
      if (!win) downloadBlob(blob, pdfName(inv));
      setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
    });

    $('sendBtn').addEventListener('click', function () {
      var inv = collectInvoice();
      if (!inv) return;
      var exists = invoices.some(function (x) { return x.number === inv.number; });
      if (exists && !window.confirm(t('numberUsed', { n: inv.number }))) return;
      if (!deliver(inv)) return;
      recordInvoice(inv);
      resetForm(false);
    });

    var sf = $('settingsForm');
    sf.addEventListener('submit', saveSettingsForm);
    sf.elements.taxRegistered.addEventListener('change', function () { sf.classList.toggle('tax-on', sf.elements.taxRegistered.checked); });

    document.querySelectorAll('.filters .chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        historyFilter = chip.getAttribute('data-filter');
        document.querySelectorAll('.filters .chip').forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        renderHistory();
      });
    });

    $('exportCsv').addEventListener('click', exportCsv);
    $('exportBackup').addEventListener('click', exportBackup);
    $('importBackup').addEventListener('change', importBackup);

    resetForm(false);
    applyI18n();
    if (!isSetUp()) showTab('settings');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
