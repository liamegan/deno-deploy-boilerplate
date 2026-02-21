<script lang="ts">
	import type { PageProps } from './$types';

	let { form }: PageProps = $props();

	let name = $state('');
	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');

	let passwordError = $derived(
		password && confirmPassword && password !== confirmPassword ? "Passwords don't match" : null
	);
</script>

<svelte:head>
	<title>Register</title>
</svelte:head>

<main class="auth-page">
	<div class="auth-container">
		<h1>Create Account</h1>
		<p class="subtitle">Join up today</p>

		{#if form?.error}
			<div class="error-message">
				{form.error}
			</div>
		{/if}

		<form method="POST">
			<div class="form-group">
				<label for="name">Name (optional)</label>
				<input
					type="text"
					id="name"
					name="name"
					bind:value={name}
					autocomplete="name"
					placeholder="Your name"
				/>
			</div>

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
					minlength="8"
					autocomplete="new-password"
					placeholder="••••••••"
				/>
			</div>

			<div class="form-group">
				<label for="confirmPassword">Confirm Password</label>
				<input
					type="password"
					id="confirmPassword"
					name="confirmPassword"
					bind:value={confirmPassword}
					required
					autocomplete="new-password"
					placeholder="••••••••"
				/>
				{#if passwordError}
					<span class="field-error">{passwordError}</span>
				{/if}
			</div>

			<button type="submit" class="btn-primary" disabled={!!passwordError}> Create Account </button>
		</form>

		<p class="auth-link">
			Already have an account? <a href="/login">Sign in</a>
		</p>
	</div>
</main>

<style>
	.auth-page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.auth-container {
		background: white;
		padding: 2rem;
		border-radius: 12px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 0.25rem 0;
		color: #333;
		font-size: 1.75rem;
	}

	.subtitle {
		color: #666;
		margin: 0 0 1.5rem 0;
	}

	.error-message {
		background: #fee;
		color: #c00;
		padding: 0.75rem 1rem;
		border-radius: 6px;
		margin-bottom: 1rem;
		font-size: 0.9rem;
	}

	.field-error {
		display: block;
		color: #c00;
		font-size: 0.85rem;
		margin-top: 0.25rem;
	}

	.form-group {
		margin-bottom: 1rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: #333;
		font-weight: 500;
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border: 2px solid #e0e0e0;
		border-radius: 8px;
		font-size: 1rem;
		transition: border-color 0.2s;
		box-sizing: border-box;
	}

	input:focus {
		outline: none;
		border-color: #667eea;
	}

	.btn-primary {
		width: 100%;
		padding: 0.875rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 8px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			transform 0.2s,
			box-shadow 0.2s;
		margin-top: 0.5rem;
	}

	.btn-primary:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.auth-link {
		text-align: center;
		margin-top: 1.5rem;
		color: #666;
	}

	.auth-link a {
		color: #667eea;
		text-decoration: none;
		font-weight: 500;
	}

	.auth-link a:hover {
		text-decoration: underline;
	}
</style>
