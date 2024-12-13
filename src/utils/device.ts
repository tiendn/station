export const isIOS =
	/iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent) && "ontouchend" in document;
