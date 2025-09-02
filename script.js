function analyzeReviews() {
  const input = document.getElementById('review-input').value;
  const reviews = input.split('\n').filter(r => r.trim() !== '');

  let positive = 0, neutral = 0, negative = 0;

  reviews.forEach(review => {
    const text = review.toLowerCase();
    if (text.includes('great') || text.includes('love')) {
      positive++;
    } else if (text.includes('bad') || text.includes('hate')) {
      negative++;
    } else {
      neutral++;
    }
  });

  const ctx = document.getElementById('sentimentChart').getContext('2d');
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Positive', 'Neutral', 'Negative'],
      datasets: [{
        data: [positive, neutral, negative],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444']
      }]
    }
  });
}
