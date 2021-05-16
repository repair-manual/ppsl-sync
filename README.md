# ppsl-sync

Synchronizes ppsl-data with repair wiki.

## Inputs

### `mediawiki-api-endpoint`

**Required** The url for the MediaWiki API endpoint.

### `repo-local-path`

**Required** The repository local path.

## Outputs

### `time`

Completion time.

### `unused-data`

A stringified JSON object of unused data.

### `uploaded-articles`

A stringified JSON array of successfully uploaded/edited data.
