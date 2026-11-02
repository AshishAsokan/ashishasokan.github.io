**Distillation.** Frontier models are powerful but locked behind APIs — you can query them but not inspect or modify their weights. I'm interested in how much of their capability can be recovered through careful distillation, and what data regimes and query strategies make this transfer most effective.

**Model diffing.** As models evolve rapidly, it's hard to know what actually changed between versions beyond a few benchmark numbers. I want to develop better tools for comparing models — frameworks that surface meaningful behavioral differences and track compatibility across a model family over time.

**Distribution shift.** I've also worked on getting models to transfer reliably when the test distribution differs from training. This spans transformer-based approaches for source-free adaptation, vision-language supervision for cross-domain generalization, long-tail strategies for visual recognition, and federated methods for fine-tuning large models efficiently.
