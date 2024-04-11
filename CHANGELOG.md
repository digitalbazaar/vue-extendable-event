# vue-extendable-event ChangeLog

### 4.2.0 - 2024-04-dd

### Add
- Include `emit` function from `setup()` as an optional createEmitExtendable
  parameter to handle Composition API components.

### 4.1.0 - 2022-05-26

### Add
- Add `createEmitExtendable()` to be called from `setup()`.

### 4.0.1 - 2022-05-25

### Fixed
- Ensure `this.$emitExtendable()` can be called from component methods.

### 4.0.0 - 2022-05-25

### Added
- Export `emitExtendable` which can be called from `setup()` or elsewhere.

### Removed
- **BREAKING**: Remove Vue 2.x support.

### 3.0.0 - 2022-05-24

### Added
- **BREAKING**: Support installation with Vue 2.x or Vue 3.x.

### 2.0.0 - 2022-04-10

### Changed
- **BREAKING**: Rename package to `@digitalbazaar/vue-extendable-event`.
- **BREAKING**: Convert to module (ESM).

### 1.0.0 - 2020-03-24

### Added
- Add core files.

- See git history for changes previous to this release.
