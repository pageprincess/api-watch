<script>
	import { goto } from '$app/navigation';

	let email = '';

	async function handleSignup(e) {
		e.preventDefault();
		if (!email) return;
		// TODO: Implement signup flow
		goto('/signup?email=' + encodeURIComponent(email));
	}
</script>

<svelte:head>
	<title>APIWatch - Monitor API Breaking Changes Before They Break Your App</title>
	<meta name="description" content="Get proactive alerts when APIs you depend on introduce breaking changes. Monitor OpenAPI specs, detect breaking changes automatically." />
</svelte:head>

<!-- Hero Section -->
<section class="hero">
	<div class="container">
		<div class="hero-content">
			<div class="badge badge-success">Now in Early Access</div>
			<h1>Monitor API Breaking Changes <br><span class="gradient">Before They Break Your App</span></h1>
			<p class="hero-subtitle">
				APIWatch is your canary deployment for third-party APIs. Get alerted when Stripe, GitHub, OpenAI,
				or any API you depend on introduces breaking changes—before your users report them.
			</p>
			<form on:submit={handleSignup} class="signup-form">
				<input
					type="email"
					bind:value={email}
					placeholder="Enter your email"
					required
					class="email-input"
				/>
				<button type="submit" class="btn btn-primary btn-large">Start Free Monitoring</button>
			</form>
			<p class="hero-note">No credit card required. Free forever for 1 API.</p>
		</div>
		<div class="hero-visual">
			<div class="code-window">
				<div class="window-header">
					<span class="dot red"></span>
					<span class="dot yellow"></span>
					<span class="dot green"></span>
				</div>
				<div class="window-content">
					<div class="alert-box">
						<div class="alert-header">⚠️ Breaking Change Detected</div>
						<div class="alert-body">
							<div class="alert-item">
								<span class="badge badge-error">DELETED</span>
								<code>DELETE /v1/charges/:id</code>
							</div>
							<div class="alert-meta">
								<span>Stripe API</span>
								<span>2 minutes ago</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- Problem Section -->
<section class="problem">
	<div class="container">
		<h2>The Silent Killer of Production Apps</h2>
		<p class="section-subtitle">
			Third-party APIs change without warning. Your app breaks at 3 AM. Customers are angry.
		</p>
		<div class="problem-grid">
			<div class="problem-card">
				<div class="problem-icon">🌙</div>
				<h3>Late Night Incidents</h3>
				<p>API providers push changes. Your code breaks. PagerDuty wakes you up at 3 AM.</p>
			</div>
			<div class="problem-card">
				<div class="problem-icon">🔍</div>
				<h3>Hours of Debugging</h3>
				<p>You spend hours tracing errors only to discover an API field was renamed.</p>
			</div>
			<div class="problem-card">
				<div class="problem-icon">😤</div>
				<h3>Angry Customers</h3>
				<p>Payment failures, data loss, broken features. Customers lose trust in your product.</p>
			</div>
		</div>
	</div>
</section>

<!-- Solution Section -->
<section class="solution">
	<div class="container">
		<h2>Know Before It Breaks</h2>
		<p class="section-subtitle">
			APIWatch monitors API specifications and alerts you the moment a breaking change is detected.
		</p>
		<div class="solution-grid">
			<div class="solution-card">
				<div class="solution-number">1</div>
				<h3>Add Your APIs</h3>
				<p>Select from templates (Stripe, GitHub, OpenAI) or add any OpenAPI URL.</p>
			</div>
			<div class="solution-card">
				<div class="solution-number">2</div>
				<h3>We Monitor Continuously</h3>
				<p>Our engine checks for changes every hour (Pro: every 15 minutes).</p>
			</div>
			<div class="solution-card">
				<div class="solution-number">3</div>
				<h3>Get Instant Alerts</h3>
				<p>Receive email, Slack, or webhook notifications when breaking changes appear.</p>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="features">
	<div class="container">
		<h2>Why APIWatch?</h2>
		<div class="feature-grid">
			<div class="feature-card">
				<h3>🎯 Breaking Change Detection</h3>
				<p>We don't just detect changes—we analyze them. Only true breaking changes trigger alerts.</p>
			</div>
			<div class="feature-card">
				<h3>📧 Email + Slack Alerts</h3>
				<p>Get notified where you work. Custom webhooks for integrating with your existing tools.</p>
			</div>
			<div class="feature-card">
				<h3>📊 Change History</h3>
				<p>Full timeline of all API changes. Track how your dependencies evolve over time.</p>
			</div>
			<div class="feature-card">
				<h3>🚀 One-Click Setup</h3>
				<p>Add a monitored API in under 60 seconds. No complex configuration required.</p>
			</div>
			<div class="feature-card">
				<h3>🔄 OpenAPI & GraphQL</h3>
				<p>Support for REST (OpenAPI/Swagger) and GraphQL schemas. More coming soon.</p>
			</div>
			<div class="feature-card">
				<h3>💰 Predictable Pricing</h3>
				<p>Pay per API monitored, not per request. No surprise bills at the end of the month.</p>
			</div>
		</div>
	</div>
</section>

<!-- Pricing Section -->
<section class="pricing">
	<div class="container">
		<h2>Simple, Transparent Pricing</h2>
		<p class="section-subtitle">Start free, upgrade when you need more.</p>
		<div class="pricing-grid">
			<div class="pricing-card">
				<h3>Free</h3>
				<div class="price">$0<span class="period">/forever</span></div>
				<ul class="features-list">
					<li>✓ 1 API monitored</li>
					<li>✓ Daily checks</li>
					<li>✓ Email alerts</li>
					<li>✓ 30-day history</li>
				</ul>
				<button class="btn btn-secondary">Start Free</button>
			</div>
			<div class="pricing-card featured">
				<div class="badge badge-success">Most Popular</div>
				<h3>Starter</h3>
				<div class="price">$29<span class="period">/month</span></div>
				<ul class="features-list">
					<li>✓ 5 APIs monitored</li>
					<li>✓ Hourly checks</li>
					<li>✓ Email + Slack alerts</li>
					<li>✓ Unlimited history</li>
				</ul>
				<button class="btn btn-primary">Get Started</button>
			</div>
			<div class="pricing-card">
				<h3>Pro</h3>
				<div class="price">$99<span class="period">/month</span></div>
				<ul class="features-list">
					<li>✓ 25 APIs monitored</li>
					<li>✓ Every 15 minutes</li>
					<li>✓ Webhook alerts</li>
					<li>✓ Team access (10 users)</li>
				</ul>
				<button class="btn btn-secondary">Get Started</button>
			</div>
		</div>
	</div>
</section>

<!-- CTA Section -->
<section class="cta">
	<div class="container">
		<h2>Stop Waking Up to Broken APIs</h2>
		<p>Join hundreds of developers who monitor their critical APIs with APIWatch.</p>
		<form on:submit={handleSignup} class="signup-form-inline">
			<input
				type="email"
				bind:value={email}
				placeholder="Enter your email"
				required
				class="email-input-large"
			/>
			<button type="submit" class="btn btn-primary btn-large">Start Free Monitoring</button>
		</form>
	</div>
</section>

<!-- Footer -->
<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-brand">
				<h4>APIWatch</h4>
				<p>Monitor API breaking changes before they break your app.</p>
			</div>
			<div class="footer-links">
				<h4>Product</h4>
				<a href="/features">Features</a>
				<a href="/pricing">Pricing</a>
				<a href="/docs">Documentation</a>
			</div>
			<div class="footer-links">
				<h4>Company</h4>
				<a href="/about">About</a>
				<a href="https://github.com/pageprincess/api-watch">GitHub</a>
				<a href="https://twitter.com/apiwatch">Twitter</a>
			</div>
		</div>
		<div class="footer-bottom">
			<p>&copy; 2026 APIWatch. Part of Auto Company.</p>
		</div>
	</div>
</footer>

<style>
	.hero {
		min-height: 90vh;
		display: flex;
		align-items: center;
		padding: 60px 0;
		background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
	}

	.hero-content {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		align-items: center;
	}

	.hero-content h1 {
		font-size: 56px;
		line-height: 1.1;
		font-weight: 800;
		margin: 24px 0;
		color: var(--color-text);
	}

	.gradient {
		background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hero-subtitle {
		font-size: 20px;
		color: var(--color-text-light);
		margin-bottom: 32px;
		line-height: 1.6;
	}

	.signup-form {
		display: flex;
		gap: 12px;
		margin-bottom: 16px;
	}

	.email-input {
		flex: 1;
		padding: 16px 20px;
		border: 2px solid var(--color-border);
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.2s;
	}

	.email-input:focus {
		outline: none;
		border-color: var(--color-primary);
	}

	.hero-note {
		color: var(--color-text-light);
		font-size: 14px;
	}

	.code-window {
		background: #1e1e1e;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		transform: perspective(1000px) rotateY(-5deg) rotateX(5deg);
		transition: transform 0.3s ease;
	}

	.code-window:hover {
		transform: perspective(1000px) rotateY(0) rotateX(0);
	}

	.window-header {
		background: #2d2d2d;
		padding: 12px 16px;
		display: flex;
		gap: 8px;
	}

	.dot {
		width: 12px;
		height: 12px;
		border-radius: 50%;
	}

	.dot.red { background: #ff5f56; }
	.dot.yellow { background: #ffbd2e; }
	.dot.green { background: #27c93f; }

	.window-content {
		padding: 24px;
	}

	.alert-box {
		background: #2d2d2d;
		border-radius: 8px;
		border-left: 4px solid var(--color-error);
		padding: 16px;
	}

	.alert-header {
		color: #fca5a5;
		font-weight: 600;
		margin-bottom: 12px;
	}

	.alert-item {
		display: flex;
		align-items: center;
		gap: 12px;
		margin-bottom: 12px;
	}

	.alert-item code {
		background: #1e1e1e;
		padding: 4px 8px;
		border-radius: 4px;
		font-family: 'Monaco', 'Consolas', monospace;
		font-size: 13px;
		color: #fca5a5;
	}

	.alert-meta {
		display: flex;
		justify-content: space-between;
		color: #9ca3af;
		font-size: 12px;
	}

	.problem {
		padding: 80px 0;
		background: white;
	}

	.problem h2 {
		text-align: center;
		font-size: 42px;
		margin-bottom: 16px;
	}

	.section-subtitle {
		text-align: center;
		font-size: 18px;
		color: var(--color-text-light);
		margin-bottom: 48px;
	}

	.problem-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.problem-card {
		text-align: center;
		padding: 32px;
	}

	.problem-icon {
		font-size: 48px;
		margin-bottom: 16px;
	}

	.problem-card h3 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.solution {
		padding: 80px 0;
		background: var(--color-bg-alt);
	}

	.solution h2 {
		text-align: center;
		font-size: 42px;
		margin-bottom: 16px;
	}

	.solution-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.solution-card {
		background: white;
		padding: 32px;
		border-radius: 12px;
		text-align: center;
		position: relative;
	}

	.solution-number {
		width: 48px;
		height: 48px;
		background: var(--color-primary);
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 24px;
		font-weight: 700;
		margin: 0 auto 20px;
	}

	.features {
		padding: 80px 0;
		background: white;
	}

	.features h2 {
		text-align: center;
		font-size: 42px;
		margin-bottom: 48px;
	}

	.feature-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
	}

	.feature-card {
		padding: 24px;
	}

	.feature-card h3 {
		font-size: 18px;
		margin-bottom: 12px;
	}

	.feature-card p {
		color: var(--color-text-light);
		line-height: 1.6;
	}

	.pricing {
		padding: 80px 0;
		background: var(--color-bg-alt);
	}

	.pricing h2 {
		text-align: center;
		font-size: 42px;
		margin-bottom: 16px;
	}

	.pricing-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 32px;
		max-width: 900px;
		margin: 0 auto;
	}

	.pricing-card {
		background: white;
		padding: 32px;
		border-radius: 12px;
		text-align: center;
		position: relative;
	}

	.pricing-card.featured {
		border: 2px solid var(--color-primary);
		transform: scale(1.05);
	}

	.pricing-card h3 {
		font-size: 20px;
		margin-bottom: 16px;
	}

	.price {
		font-size: 48px;
		font-weight: 800;
		margin-bottom: 24px;
	}

	.period {
		font-size: 16px;
		font-weight: 400;
		color: var(--color-text-light);
	}

	.features-list {
		list-style: none;
		text-align: left;
		margin: 0 0 24px 0;
	}

	.features-list li {
		padding: 8px 0;
		color: var(--color-text-light);
	}

	.cta {
		padding: 80px 0;
		background: linear-gradient(135deg, var(--color-primary) 0%, #8b5cf6 100%);
		color: white;
		text-align: center;
	}

	.cta h2 {
		font-size: 42px;
		margin-bottom: 16px;
	}

	.cta p {
		font-size: 20px;
		opacity: 0.9;
		margin-bottom: 32px;
	}

	.signup-form-inline {
		display: flex;
		justify-content: center;
		gap: 12px;
		max-width: 500px;
		margin: 0 auto;
	}

	.email-input-large {
		flex: 1;
		padding: 16px 20px;
		border: none;
		border-radius: 8px;
		font-size: 16px;
	}

	.email-input-large:focus {
		outline: none;
	}

	.footer {
		background: #1a1a1a;
		color: white;
		padding: 48px 0 24px;
	}

	.footer-content {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 48px;
		margin-bottom: 32px;
	}

	.footer-brand h4 {
		font-size: 20px;
		margin-bottom: 12px;
	}

	.footer-brand p {
		color: #9ca3af;
	}

	.footer-links h4 {
		margin-bottom: 16px;
	}

	.footer-links a {
		display: block;
		color: #9ca3af;
		text-decoration: none;
		margin-bottom: 8px;
	}

	.footer-links a:hover {
		color: white;
	}

	.footer-bottom {
		text-align: center;
		padding-top: 24px;
		border-top: 1px solid #333;
		color: #9ca3af;
	}

	@media (max-width: 768px) {
		.hero-content {
			grid-template-columns: 1fr;
		}

		.hero-content h1 {
			font-size: 36px;
		}

		.problem-grid,
		.solution-grid,
		.feature-grid,
		.pricing-grid {
			grid-template-columns: 1fr;
		}

		.pricing-card.featured {
			transform: scale(1);
		}

		.footer-content {
			grid-template-columns: 1fr;
			gap: 32px;
		}
	}
</style>
