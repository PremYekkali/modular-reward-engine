# Architecture Overview

The reward engine is designed as a pure accounting layer.

External systems:
- calculate user shares
- report share changes
- fund reward tokens

The RewardManager:
- tracks reward accrual
- distributes rewards proportionally
- enforces accounting correctness

This separation keeps reward logic reusable and auditable.
