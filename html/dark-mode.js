window.addEventListener("load", function(){
    applyDarkmode();
});

const darkmodeLocalstoreKey = "darkmode";
const darkmodeMaxValue = 3;

function getDarkmodeMode() {
    let darkValue = JSON.parse(localStorage.getItem(darkmodeLocalstoreKey) || "0") - 0;
		if (darkValue >= darkmodeMaxValue) {
				darkValue = darkmodeMaxValue - 1;
		}
		if (darkValue < 0) {
				darkValue = 0;
		}
		return darkValue;
}

function toggleDarkmode() {
    const wantDark = (getDarkmodeMode() + 1) % darkmodeMaxValue;
		localStorage.setItem(darkmodeLocalstoreKey, JSON.stringify(wantDark));

    applyDarkmode();
}

function applyDarkmode() {
    const wantDark = getDarkmodeMode();
    const isDark = document.body.classList.contains("dark");
    const isLight = document.body.classList.contains("light");
		if (isDark) {
				document.body.classList.remove("dark");
		}
		if (isLight) {
				document.body.classList.remove("light");
		}
		let mode = "automatic";
		if (wantDark == 1) {
				mode = "force dark";
				document.body.classList.add("dark");
		}
		if (wantDark == 2) {
				mode = "force light";
				document.body.classList.add("light");
		}

		const darkButton = document.getElementById("dark-toggle");
		darkButton.textContent = `toggle darkmode (${mode})`;
}
