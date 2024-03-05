<div />

<style>
	div {
		--size: 100px;
		position: fixed;
		top: 0;
		left: 0;
		inset: calc(50% - calc(var(--size) / 2));
		background: green;
		border-radius: var(--size);
		height: var(--size);
		width: var(--size);
		animation: moveLoader 1s infinite alternate;
	}

	@keyframes moveLoader {
		from {
			transform: translate3d(100px, 0, 0);
		}
		to {
			transform: translate3d(-100px, 0, 0);
		}
	}
</style>
