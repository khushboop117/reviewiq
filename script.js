async function analyzeReview() {
  const review = document.getElementById("reviewInput").value;
  const resultDiv = document.getElementById("result");
  const sentimentText = document.getElementById("sentiment");

  if (!review.trim()) {
    alert("Please enter a review.");
    return;
  }

  sentimentText.textContent = "Analyzing...";
  resultDiv.classList.remove("hidden");

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "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"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `Analyze the sentiment of this review and summarize it in one sentence: "${review}"`
          }
        ]
      })
    });

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    sentimentText.textContent = analysis;
  } catch (error) {
    sentimentText.textContent = "Error analyzing review.";
    console.error(error);
  }
}
