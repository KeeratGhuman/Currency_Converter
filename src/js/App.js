(() => {
  const API_KEY     = '683993921c1d43e8a7ca87f43b1abe8b';                
  const SYMBOLS_URL = 'https://api.currencyfreaks.com/v2.0/currency-symbols';
  const LATEST_URL  = 'https://api.currencyfreaks.com/v2.0/rates/latest';

  
  const $amount  = $('#amount');   // number input
  const $from    = $('#from');     // <select> base currency
  const $to      = $('#to');       // <select> quote currency
  const $swapButton = $('#swap');     // little circular arrow button
  const $result  = $('#result');   // where the answer is printed

  /*Populating the currency options given by the API*/
  async function loadSymbols () {
    try {
      const { currencySymbols } = await fetch(SYMBOLS_URL).then(r => r.json());
      const codes = Object.keys(currencySymbols).sort();                // A-Z order

      codes.forEach(code => {
        const label = `${code} — ${currencySymbols[code]}`;            // "USD — US Dollar"
        $('<option>', { value: code, text: label }).appendTo($from);
        $('<option>', { value: code, text: label }).appendTo($to);
      });

      //defaults when user enters the application
      $from.val('USD');
      $to.val('CAD');
      convert();                                                       
    } catch (err) {
      console.error('Symbol load failed:', err);
      $result.text('⚠ Unable to load currency list.');
    }
  }

  /*Conversion logic*/
  async function convert () {
    const amt = parseFloat($amount.val());
    if (!amt || amt <= 0) {
      $result.text('Enter a valid amount');//Ensures the user enters a valid number
      return;
    }

    //if the user picks the same currency in both from and to, no need for network request 
    const from = $from.val();
    const to   = $to.val();
    if (from === to) {                                                 
      $result.text(`${amt.toFixed(2)} ${from} = ${amt.toFixed(2)} ${to}`);
      return;
    }

    try {
      // ask API only for the two relevant currencies that are being converted
      const url  = `${LATEST_URL}?apikey=${API_KEY}&symbols=${from},${to}`;
      const data = await fetch(url).then(r => r.json()); //JSON payload from the API 

      // Cross-rate math: map each currency to its USD rate since the base is USD on the free tier then amount / rateFrom × rateTo
      const baseUSD      = data.base; // base currency USD is used by the API
      const rateFromUSD  = from === baseUSD ? 1 : parseFloat(data.rates[from]);
      const rateToUSD    = to   === baseUSD ? 1 : parseFloat(data.rates[to]);
      const converted    = amt / rateFromUSD * rateToUSD; // cross-rate math

      $result.text(`${amt.toFixed(2)} ${from} = ${converted.toFixed(2)} ${to}`); //result in 2 decimal points 
    } catch (err) {
      console.error('Conversion failed:', err);
      $result.text('Conversion failed.');
    }
  }

  function addEventListeners () {
    // real-time responsiveness
    $amount.on('input',  convert);
    $from  .on('change', convert);
    $to    .on('change', convert);

    //swap interaction
    $swapButton.on('click', () => {
      const temp = $from.val();
      $from.val($to.val());
      $to.val(temp);
      convert();
    });
  }

  $(document).ready(() => {
    loadSymbols();      // asynchronously populates the selects then fires the first conversion
    addEventListeners();
  });
})();
