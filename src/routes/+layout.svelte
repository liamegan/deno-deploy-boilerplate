<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<nav class="main-nav">
	<ul class="nav-container">
		{#if data.user}
			<li class="nav-user">
				<span class="user-name">{data.user.name || data.user.email}</span>
				<form method="POST" action="/logout" class="logout-form">
					<button type="submit" class="logout-btn">Sign Out</button>
				</form>
			</li>
		{:else}
			<li class="nav-login">
				<a href="/login">Log in</a>
			</li>
			<li class="nav-account">
				<a href="/register">Create an account</a>
			</li>
		{/if}
	</ul>
</nav>

{@render children()}
