// Firebase setup
const firebaseConfig = {
  apiKey: "AIzaSyA8M76nmVsQDhH8Yorg0Q1TyS9mZxnsJMQ",
  authDomain: "review-2a24f.firebaseapp.com",
  projectId: "review-2a24f"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password)
    .then(user => alert("Signed up!"))
    .catch(err => alert(err.message));
}

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password)
    .then(user => alert("Logged in!"))
    .catch(err => alert(err.message));
}

// CSV handling
async function handleCSV() {
  const file = document.getElementById("csvUpload").files[0];
  Papa.parse(file, {
    header: true,
    complete: async function(results) {
      const reviews = results.data.map(row => row.review).filter(Boolean);
      localStorage.setItem("reviewData", JSON.stringify(reviews));
      await analyzeMultipleReviews(reviews);
    }
  });
}

async function analyzeMultipleReviews(reviews) {
  const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
  document.getElementById("reviewCards").innerHTML = "";

  for (const review of reviews) {
    const sentiment = await getSentiment(review);
    if (sentiment.includes("positive")) sentimentCounts.positive++;
    else if (sentiment.includes("neutral")) sentimentCounts.neutral++;
    else sentimentCounts.negative++;
    renderReviewCard(review, sentiment);
  }

  document.getElementById("summary").classList.remove("hidden");
  renderChart(sentimentCounts);
}

async function getSentiment(review) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "sk-proj-YSvJkEyW-VfZpoeXzPtK-mptzu_ffj_Wa5HesjXaC4JcwgbRc5jY328mgPS-UoKfT0I-EH12U7T3BlbkFJWOIWY9o6TD5LzVW22T2iVFKN0Z7yehLFYQZ1Hz60ng42X7-FUbFC4P0Z8_4Gf6G2KejX_Q1pEAY"
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

function renderReviewCard(review, sentiment) {
  const card = document.createElement("div");
  card.className = "p-4 bg-white shadow rounded";
  card.setAttribute("data-sentiment", sentiment);
  card.innerHTML = `
    <p class="text-gray-700 mb-2">${review}</p>
    <span class="text-sm font-semibold text-${sentimentColor(sentiment)}-600">${sentiment}</span>
  `;
  document.getElementById("reviewCards").appendChild(card);
}

function sentimentColor(sentiment) {
  if (sentiment.includes("positive")) return "green";
  if (sentiment.includes("neutral")) return "yellow";
  return "red";
}

function filterReviews(type) {
  const cards = document.querySelectorAll("#reviewCards > div");
  cards.forEach(card => {
    const sentiment = card.getAttribute("data-sentiment");
    card.style.display = (type === "all" || sentiment.includes(type)) ? "block" : "none";
  });
}

function renderChart(data) {
  new Chart(document.getElementById("sentimentChart"), {
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
