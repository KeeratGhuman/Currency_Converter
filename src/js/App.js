(() => {
  const API_KEY      = '683993921c1d43e8a7ca87f43b1abe8b';
  const SYMBOLS_URL  = 'https://api.currencyfreaks.com/v2.0/currency-symbols';
  const LATEST_URL   = 'https://api.currencyfreaks.com/v2.0/rates/latest';

  /* ---------- DOM refs ---------- */
  const $amount  = $('#amount');
  const $from    = $('#from');
  const $to      = $('#to');
  const $swapBtn = $('#swap');
  const $result  = $('#result');

  /* ---------- 1. Populate <select> with full symbol list ---------- */
  async function loadSymbols() {
    try {
      const { currencySymbols } = await fetch(SYMBOLS_URL).then(r => r.json());
      const codes = Object.keys(currencySymbols).sort();

      codes.forEach(code => {
        const optionText = `${code} — ${currencySymbols[code]}`;
        $('<option>', { value: code, text: optionText }).appendTo($from);
        $('<option>', { value: code, text: optionText }).appendTo($to);
      });

      // sensible defaults
      $from.val('USD');
      $to.val('CAD');
      convert();                   // first calculation
    } catch (err) {
      console.error(err);
      $result.text('⚠️ Unable to load currency list.');
    }
  }

  /* ---------- 2. Convert amount via latest-rates endpoint ---------- */
  async function convert() {
    const amt = parseFloat($amount.val());
    if (!amt || amt <= 0) {
      $result.text('Enter a valid amount');
      return;
    }

    const from = $from.val();
    const to   = $to.val();
    if (from === to) {
      $result.text(`${amt.toFixed(2)} ${from} = ${amt.toFixed(2)} ${to}`);
      return;
    }

    try {
      // Request only the two needed symbols to keep payload tiny
      const url   = `${LATEST_URL}?apikey=${API_KEY}&symbols=${from},${to}`;
      const json  = await fetch(url).then(r => r.json());

      const base        = json.base;          // always USD on free plan
      const rateFrom    = from === base ? 1 : parseFloat(json.rates[from]);
      const rateTo      = to   === base ? 1 : parseFloat(json.rates[to]);
      const converted   = amt / rateFrom * rateTo;

      // pretty-print
      $result.text(`${amt.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`);
    } catch (err) {
      console.error(err);
      $result.text('⚠️ Conversion failed.');
    }
  }

  /* ---------- 3. Wire up events ---------- */
  function addEventListeners() {
    $amount.on('input',  convert);
    $from  .on('change', convert);
    $to    .on('change', convert);

    $swapBtn.on('click', () => {
      const tmp = $from.val();
      $from.val($to.val());
      $to.val(tmp);
      convert();
    });
  }

  /* ---------- 4. Boot ---------- */
  $(document).ready(() => {
    loadSymbols();
    addEventListeners();
  });
})();
