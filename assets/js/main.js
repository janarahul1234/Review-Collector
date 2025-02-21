const getElement = (selector) => document.querySelector(selector);

const username = getElement("#username");
const review = getElement("#review");
const placeholderText = getElement("#placeholder-text");
const toolbar = getElement("#toolbar");
const buttonSubmit = getElement("#btn-submit");
const reviewsCount = getElement("#reviews-count");
const reviewsContainer = getElement("#reviews-container");
const buttonSortReviews = getElement("#btn-sort");
const suggestion = getElement("#suggestion");
const suggestions = getElement("#suggestions");

let reviews = [
  {
    id: 1,
    username: "Aarav Sharma",
    review:
      "This review collector is amazing! The UI is smooth, and I love the formatting options.",
    timestamp: 1739942508687,
    likes: 12,
    isLiked: false,
  },
  {
    id: 2,
    username: "Priya Verma",
    review:
      "A simple and efficient tool for collecting feedback. Makes the process hassle-free!",
    timestamp: 1739942105687,
    likes: 25,
    isLiked: true,
  },
  {
    id: 3,
    username: "Rohan Iyer",
    review:
      "User-friendly design and seamless functionality. Highly recommended for <b>businesses!</b>",
    timestamp: 1739941804687,
    likes: 8,
    isLiked: false,
  },
];

let currentSort = 0;
const sortingOptions = ["Most recent", "Oldest", "Top reviews"];

const updatePlaceholderVisibility = () => {
  const isEmpty = review.textContent.trim().length === 0;
  placeholderText.classList.toggle("hidden", !isEmpty);
  suggestion.classList.toggle("hidden", !isEmpty);
};

review.addEventListener("input", updatePlaceholderVisibility);
review.addEventListener("focus", () => suggestion.classList.remove("hidden"));

[...toolbar.children].forEach((btn) =>
  btn.addEventListener("click", () =>
    document.execCommand(btn.dataset.command, false, null)
  )
);

[...suggestions.children].forEach((sugg) =>
  sugg.addEventListener("click", () => {
    review.innerHTML = sugg.innerText;
    updatePlaceholderVisibility();
  })
);

buttonSortReviews.addEventListener("click", () => {
  currentSort = currentSort === sortingOptions.length - 1 ? 0 : currentSort + 1;
  buttonSortReviews.innerHTML = `<i class="ri-arrow-up-down-line"></i> ${sortingOptions[currentSort]}`;
  renderReviews();
});

const createReviewElement = ({
  id,
  username,
  review,
  timestamp,
  likes,
  isLiked,
}) => {
  const element = document.createElement("div");
  element.innerHTML = `
    <h3 class="text-sm mb-1.5">
      <span class="font-semibold">${username}</span> • ${formatTimestamp(
    timestamp
  )}
    </h3>
    <p class="text-gray-950 mb-2">${review}</p>
    <button class="btn-like px-2.5 py-1 flex gap-1 border border-gray-300 rounded-full cursor-pointer hover:bg-gray-100 transition ${
      isLiked ? "text-blue-600" : ""
    }" data-id="${id}">
      <i class="ri-thumb-up-${isLiked ? "fill" : "line"}"></i> ${likes}
    </button>
  `;
  return element;
};

const renderReviews = () => {
  reviewsContainer.innerHTML = "";
  reviewsCount.textContent = reviews.length;

  const sortingMethods = [
    () => sortByField(reviews, "id", "desc"), // Most recent
    () => sortByField(reviews, "id", "asc"), // Oldest
    () => sortByField(reviews, "likes", "desc"), // Top reviews
  ];

  sortingMethods[currentSort]().forEach((review) => {
    reviewsContainer.appendChild(createReviewElement(review));
  });
  bindLikeEvents();
};

const bindLikeEvents = () => {
  reviewsContainer.querySelectorAll(".btn-like").forEach((btn) =>
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const review = reviews.find((r) => r.id === id);
      review.isLiked = true;
      review.likes += 1;
      renderReviews();
    })
  );
};

function sortByField(array, field, order = "asc") {
  return [...array].sort((a, b) =>
    order === "asc" ? a[field] - b[field] : b[field] - a[field]
  );
}

const formatTimestamp = (timestamp) => {
  const diff = Math.floor((Date.now() - timestamp) / 1000);
  if (diff < 1) return "now";
  if (diff < 60) return `${diff} sec ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

buttonSubmit.addEventListener("click", () => {
  if (!username.value.trim() || !review.innerHTML.trim()) return;

  reviews.push({
    id: reviews.length + 1,
    username: username.value,
    review: review.innerHTML,
    timestamp: Date.now(),
    likes: 0,
    isLiked: false,
  });

  renderReviews();
  username.value = "";
  review.innerHTML = "";
  placeholderText.classList.remove("hidden");
  suggestion.classList.add("hidden");
});

renderReviews();
