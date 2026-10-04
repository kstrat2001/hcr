import { test } from '@japa/runner'
import { DE_LEGAL, startProjectUrl } from '../../inertia/lib/de_links.js'

test.group('Darkly Energized links', () => {
  test('a campaign link goes to DE "Start a project" with HCR tags', ({ assert }) => {
    assert.equal(
      startProjectUrl('nav'),
      'https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign=nav'
    )
  })

  test('a tier is carried as utm_content', ({ assert }) => {
    assert.equal(
      startProjectUrl('pricing', 'evals_tests'),
      'https://darklyenergized.com/projects/new?utm_source=hcr&utm_medium=referral&utm_campaign=pricing&utm_content=evals_tests'
    )
  })

  test('legal links are DE pages', ({ assert }) => {
    assert.deepEqual(DE_LEGAL, {
      terms: 'https://darklyenergized.com/terms',
      privacy: 'https://darklyenergized.com/privacy',
      disclaimer: 'https://darklyenergized.com/disclaimer',
    })
  })
})
