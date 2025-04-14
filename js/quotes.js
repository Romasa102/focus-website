// Array of inspirational quotes with authors
const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Anonymous" },
    { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
    { text: "The beautiful thing about learning is that no one can take it away from you.", author: "B.B. King" },
    { text: "The mind is not a vessel to be filled, but a fire to be kindled.", author: "Plutarch" },
    { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
    { text: "The difference between ordinary and extraordinary is that little extra.", author: "Jimmy Johnson" },
    { text: "The best way to predict your future is to create it.", author: "Abraham Lincoln" },
    // Added diligence‑boosting quotes
    { text: "Dreams don't work unless you do.", author: "John C. Maxwell" },
    { text: "The difference between try and triumph is a little 'umph'.", author: "Marvin Phillips" },
    { text: "Hard work beats talent when talent doesn’t work hard.", author: "Tim Notke" },
    { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
    { text: "The only place where success comes before work is in the dictionary.", author: "Vidal Sassoon" },
    { text: "Opportunities are usually disguised as hard work, so most people don't recognize them.", author: "Ann Landers" },
    { text: "I’m a greater believer in luck, and I find the harder I work the more I have of it.", author: "Thomas Jefferson" },
    { text: "If people knew how hard I worked to gain my mastery, it would not seem so wonderful at all.", author: "Michelangelo" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "Work hard in silence, let success make the noise.", author: "Frank Ocean" },
    { text: "Perseverance is the hard work you do after you get tired of doing the hard work you already did.", author: "Newt Gingrich" },
    { text: "There is no substitute for hard work.", author: "Thomas Edison" },
    { text: "Great things are done by a series of small things brought together.", author: "Vincent Van Gogh" },
    { text: "Do not whine... Do not complain. Work harder. Spend more time alone.", author: "Joan Didion" },
    { text: "Don’t be busy; be productive.", author: "Anonymous" },
    { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "It’s not about money or connections – it’s the willingness to outwork and outlearn everyone.", author: "Mark Cuban" },
    { text: "You don’t have to be extreme, just consistent.", author: "Unknown" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" }
];

// Function to display a random quote with fade effect
function displayRandomQuote() {
    const qt = document.getElementById("quote-text");
    const qa = document.getElementById("quote-author");

    // start fade‑out
    qt.classList.add("fade");
    qa.classList.add("fade");

    // after fade‑out finishes, swap text and fade back in
    setTimeout(() => {
        const { text, author } = quotes[Math.floor(Math.random() * quotes.length)];
        qt.textContent = `"${text}"`;
        qa.textContent = `‑ ${author}`;

        qt.classList.remove("fade");
        qa.classList.remove("fade");
    }, 400);
}

document.addEventListener("DOMContentLoaded", () => {
    displayRandomQuote();
    setInterval(displayRandomQuote, 3_000);

    document.body.addEventListener("click", (e) => {
        if (e.target.closest("header")) return; // ignore top bar clicks
        displayRandomQuote();
    });

    document.body.addEventListener("keyup", (e) => {
        if (e.key === " " || e.key === "Enter") displayRandomQuote();
    });
});
