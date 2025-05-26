## Project Overview
A single-page currency converter built with **HTML, Vanilla JavaScript, jQuery, and Tailwind CSS**.  
It performs real-time conversions between any two ISO 4217 currencies using a free, client-side REST API (e.g., *exchangerate.host*). No `<form>` elements or server-side code are used, satisfying Scotiabank’s assignment constraints.

---

## Key Technologies
| Tech | Purpose |
|------|---------|
| **HTML5** | Semantic structure for the UI |
| **Tailwind CSS (CDN)** | Utility-first styling with a clean banking aesthetic |
| **jQuery 3.x** | Concise DOM manipulation & event handling |
| **Fetch API** | Retrieves live exchange rates in JSON |
| **ES6 JavaScript** | `async/await`, arrow functions, template literals |

---

## How It Works
1. **User Input**  
   * Amount field (`input[type="number"]`, `step="0.01"`).  
   * “From” and “To” dropdowns auto-populated with supported currency codes.
2. **Live Conversion**  
   * `input` and `change` events fire `convert()` instantly—no submit button.  
   * Makes a GET request
   * Parses the JSON response and displays the converted total to two decimal places.
3. **Error Handling**  
   * Shows friendly messages if the API is unreachable or data is invalid.
