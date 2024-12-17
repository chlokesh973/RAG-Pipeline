// Query Route
app.post('/query', async (req, res) => {
    try {
      const { query } = req.body;
  
      // Check if the query is asking for ticker information
      if (query.toLowerCase().includes("ticker") || query.toLowerCase().includes("price")) {
        // Fetch the ticker information for BTC/USD
        const tickerData = await gemini.getTicker('btcusd'); // Gemini API method to fetch ticker
        const answer = `The current price of BTC/USD is $${tickerData.last}`;
        res.json({ success: true, answer });
      } else {
        res.json({ success: false, error: "Invalid query. Please ask about ticker information or PDF content." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  });
  