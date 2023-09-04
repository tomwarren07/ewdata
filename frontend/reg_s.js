document.addEventListener("DOMContentLoaded", function () {
    // Load and play the animation
    const animationContainer = document.getElementById("animation-container");
    const animation = bodymovin.loadAnimation({
        container: animationContainer,
        renderer: "svg", // Use SVG or "canvas" based on your preference
        loop: false, // Set to true if you want the animation to loop
        autoplay: true,
        path: "success.json",
    });
});
