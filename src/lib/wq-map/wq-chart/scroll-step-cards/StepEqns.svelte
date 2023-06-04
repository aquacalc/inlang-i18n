<script>
	export let value;
	export let step = 1;
</script>

<div>
	<h4 class="index-of-count" class:active={value + 1 === step}>{step} of 6</h4>
	<h3 class="step-title" class:active={value + 1 === step}>Water chemistry is complicated</h3>

	<section class:active={value + 1 === step}>
		<p>
			Water chemistry is a technical topic filled with equations and confusing chemical concepts.
		</p>

		<p>That's a barrier for many aquaculturists who operate sustainable recirc systems.</p>

		<p>A visual approach makes water-quality management accessible to all aquaculturists.</p>
	</section>
</div>
