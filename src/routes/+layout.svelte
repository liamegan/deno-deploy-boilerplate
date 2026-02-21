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

{#if data.user}
	<nav class="main-nav">
		<div class="nav-container">
			<div class="nav-user">
				<span class="user-name">{data.user.name || data.user.email}</span>
				<form method="POST" action="/logout" class="logout-form">
					<button type="submit" class="logout-btn">Sign Out</button>
				</form>
			</div>
		</div>
	</nav>
{/if}

{@render children()}
