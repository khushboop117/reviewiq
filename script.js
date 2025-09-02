async function analyzeReviews() {
  const input = document.getElementById("reviewsInput").value;
  const reviews = input.split("\n").filter(r => r.trim() !== "");
  const summaryDiv = document.getElementById("summary");
  const chartCanvas = document.getElementById("sentimentChart");

  if (reviews.length === 0) {
    alert("Please enter at least one review.");
    return;
  }

  let sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

  for (const review of reviews) {
    const sentiment = await getSentiment(review);
    if (sentiment.includes("positive")) sentimentCounts.positive++;
    else if (sentiment.includes("neutral")) sentimentCounts.neutral++;
    else sentimentCounts.negative++;
  }

  summaryDiv.classList.remove("hidden");
  renderChart(sentimentCounts, chartCanvas);
}

async function getSentiment(review) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer YOUR_OPENAI_API_KEY"
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Classify this review as positive, neutral, or negative: "${review}"`
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content.toLowerCase();
}

function renderChart(data, canvas) {
  new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Positive", "Neutral", "Negative"],
      datasets: [{
        label: "Review Sentiment",
        data: [data.positive, data.neutral, data.negative],
        backgroundColor: ["#34D399", "#FBBF24", "#F87171"]
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
