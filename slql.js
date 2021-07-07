////////////////////////////
// CMS Tags + Quick Links //
////////////////////////////

function toArray(x) {
	let y = []; if(x === undefined) {return y}
	for(let i = 0; i < x.length; i++) {y.push(x[i])}
	return y
}

// CMS Tags
toArray(document.querySelectorAll("p")).forEach(x => {
	if(x.textContent.substring(0, 3) == "//[") {
		// inject
		if(x.textContent.substring(0, 10) == "//[inject:") {
			x.style.display = "none";
			let y = x.textContent.replace("//[inject:", "").replace("]", "");
			let z = document.querySelector("[data-inject='" + y + "']").cloneNode(true);
			x.parentNode.insertBefore(z, x.nextSibling);
			x.parentNode.removeChild(x)
		}
		// class
		else if(x.textContent.substring(0, 9) == "//[class:") {
			x.style.display = "none";
			let y = x.textContent.replace("//[class:", "").replace("]", "");
			x.previousSibling.classList.add(y);
			x.parentNode.removeChild(x)
		}
		// style
		else if(x.textContent.substring(0, 9) == "//[style:") {
			x.style.display = "none";
			let y = x.textContent.replace("//[style:", "").replace("]", "");
			x.previousSibling.style[y.split("=")[0]] = y.split("=")[1];
			x.parentNode.removeChild(x)
		}
	}
});

// Quick Links
let qlinks = [];
toArray(document.querySelectorAll("[data-qlinks='content']")).forEach(x => {
	toArray(document.querySelectorAll("[data-qlinks='links']")).forEach(y => {
		let ancr = document.querySelector("[data-qlinks='anchor']");
		let sect = y.querySelector("[data-qlinks='section']");
		let link = y.querySelector("[data-qlinks='link']");
		qlinks.push({"sect": sect, "links": [{"link": link, "ancr": ancr}]});
		toArray(x.querySelectorAll("h2, h3")).forEach((z, i) => {
			let newAncr, newSect, newLink;
			// anchor
			newAncr = ancr.cloneNode(false);
			newAncr.id = "s" + (i + 1);
			z.parentNode.insertBefore(newAncr, z);
			// section
			if(z.tagName == "H2") {
				newSect = sect.cloneNode(false);
				newSect.classList.remove("current");
				sect.parentNode.appendChild(newSect);
				qlinks.push({"sect": newSect, "links": []});
				sect = newSect
			}
			// link
			newLink = link.cloneNode(true);
			newLink.classList.remove("current");
			newLink.classList.remove("sub");
			if(z.tagName != "H2") {newLink.classList.add("sub")}
			newLink.textContent = z.textContent;
			newLink.href = "#s" + (i + 1);
			qlinks[qlinks.length - 1].links.push({"link": newLink, "ancr": newAncr});
			link = newLink;
			sect.appendChild(link)
		})
	})
});

function getWinH() {return 100}
let wh = getWinH(), cur = [0, 0];
function setCurrent() {
	let brk = false;
	// find current
	qlinks.every((x, i) => {
		// cur[0] = i;
		x.links.every((y, j) => {
			if(y.ancr.getBoundingClientRect().top <= wh) {
				cur[0] = i; cur[1] = j; return true}
			else {brk = true; return false}
		});
		if(brk) {return false}
		return true
	});
	// set styles
	qlinks.forEach((x, i) => {
		if(cur[0] == i) {x.sect.classList.add("current")}
		else {x.sect.classList.remove("current")}
		x.links.forEach((y, j) => {
			if(cur[0] == i && cur[1] == j) {y.link.classList.add("current")}
			else {y.link.classList.remove("current")}
		})
	})
}
document.addEventListener("resize", () => {wh = getWinH()});
document.addEventListener("scroll", setCurrent);

// List Size
function injectChange(x) {
	if(!localStorage.usersize) {return}
	let a = ["ad-event", "ad-demo"]; if(localStorage.usersize == 1) {a[0] = "ad-demo"; a[1] = "ad-event"}
	if(x === true) {
		let z = document.querySelector("[data-inject='" + a[1] + "']");
		b.forEach((y, i) => {
			if(y.hasAttribute("data-inject") && y.getAttribute("data-inject") == a[0]) {
				b[i] = z.cloneNode(true)
			}
		})
	}
	else {
		let y = toArray(document.querySelectorAll("[data-inject='" + a[0] + "']"));
		let z = document.querySelector("[data-inject='" + a[1] + "']");
		for(let i = 0; i < y.length - 1; i++) {
			y[i].parentNode.insertBefore(z.cloneNode(true), y[i].nextSibling);
			y[i].parentNode.removeChild(y[i])
		}
	}
}
injectChange(false);

document.querySelector("[data-action='listsize']").addEventListener("input", (e) => {
	if(e.target.value.split(" - ")[1].replace(",", "") <= 5000) {localStorage.usersize = 0}
	else {localStorage.usersize = 1}
	injectChange(true)
});
