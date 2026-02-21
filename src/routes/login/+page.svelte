<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let email = $state('');
	let password = $state('');
</script>

<svelte:head>
	<title>Login - Recipe Box</title>
</svelte:head>

<main class="auth-page">
	<div class="auth-container">
		<h1>Welcome Back</h1>
		<p class="subtitle">Sign in to your Recipe Box</p>

		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					name="email"
					bind:value={email}
					required
					autocomplete="email"
					placeholder="you@example.com"
				/>
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					bind:value={password}
					required
					autocomplete="current-password"
					placeholder="••••••••"
				/>
			</div>

			<button type="submit" class="btn-primary">Sign In</button>
		</form>

		<p class="auth-link">
			Don't have an account? <a href="/register">Create one</a>
		</p>
	</div>
</main>
