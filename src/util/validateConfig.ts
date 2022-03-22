import {PluginOptions, Reporter} from 'gatsby'
import {prefixId} from './documentIds'
import {ERROR_CODES} from './errors'

export interface PluginConfig extends PluginOptions {
  projectId: string
  dataset: string
  token?: string
  version?: string
  graphqlTag: string
  overlayDrafts?: boolean
  watchMode?: boolean
  watchModeBuffer?: number
  types?: string[]
}

export default function validateConfig(
  config: Partial<PluginConfig>,
  reporter: Reporter,
): config is PluginConfig {
  if (!config.projectId) {
    reporter.panic({
      id: prefixId(ERROR_CODES.MissingProjectId),
      context: {sourceMessage: '[sanity-exo] `projectId` must be specified'},
    })
  }

  if (!config.dataset) {
    reporter.panic({
      id: prefixId(ERROR_CODES.MissingDataset),
      context: {sourceMessage: '[sanity-exo] `dataset` must be specified'},
    })
  }

  if (config.overlayDrafts && !config.token) {
    reporter.warn('[sanity-exo] `overlayDrafts` is set to `true`, but no token is given')
  }

  const inDevelopMode = process.env.gatsby_executing_command === 'develop'
  if (config.watchMode && !inDevelopMode) {
    reporter.warn(
      '[sanity-exo] Using `watchMode` when not in develop mode might prevent your build from completing',
    )
  }

  return true
}
