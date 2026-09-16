---
slug: contributing-with-agents
title: Contributing with agents, without outsourcing responsibility
deck: Coding agents can lower the friction of open source work, but useful contributions still need human context, verification and care.
date: 2026-09-16
category: Guide
readTime: 10 min read
tags: [Contribution, Community, Trust, Maintainers]
featured: false
---

A coding agent can inspect a repository, suggest a plan, edit files, run commands and sometimes open a pull request. That can give a contributor useful leverage. It does not transfer responsibility for understanding the change, checking its provenance, protecting project information or maintaining the result.

This guide is for people contributing to open source and internal projects, and for the maintainers who receive their work. It is not a universal policy. The target project or organisation's rules always come first.

## Start with the boundary

A coding agent is more than autocomplete. It may be able to read a codebase, make a multi-file change, invoke tools and communicate with other systems. The more reach it has, the more important the boundary around it becomes.

A useful default is simple: give the tool the smallest access it needs, keep writes on a working branch, and do not give it merge, release, secret or publishing credentials. Treat every command, suggestion and explanation as work to verify rather than evidence that verification has already happened.

## What agents can improve

Agents can make some parts of contribution easier:

- **Repository orientation:** They can help map unfamiliar folders, find related tests, explain build steps and turn a long issue into questions worth answering. A contributor still needs to read the relevant source and project guidance.
- **Repetitive changes:** They can draft documentation updates, migrate a repeated pattern or prepare a first pass at a test matrix. The contributor should check the whole diff for exceptions, unnecessary changes and altered meaning.
- **Exploration and debugging:** They can suggest hypotheses, generate a reproducer or compare likely causes. A hypothesis is not a confirmed bug. Run the reproducer and check the result independently.
- **Security work:** The [OpenSSF practical guide on securing open source in the age of AI](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/) describes useful applications for investigation, vulnerability reports and remediation, alongside risks such as hallucinations, slopsquatting and inflated severity assessments. Its central lesson is that familiar security practice still matters.
- **Communication:** They can help turn notes into an issue description, explain an error in plainer language or identify missing context in a pull request. They should not invent a reproduction, an approval, a source or a maintainer's position.

A report by [Gregg Cochran for GitHub on 50 open source projects](https://github.blog/open-source/maintainers/what-50-open-source-projects-taught-us-about-security-in-the-ai-era/) records AI-assisted workflows being used alongside maintainer expertise, security tools and expert support. The reported lesson is useful: AI can help teams investigate, prioritise and respond faster, but maintainers still provide the context, judgement and accountability for what ships.

The benefit is therefore not “the agent did the contribution.” The benefit is that a person may spend less time on mechanical work and more time understanding the problem, testing the result and working with the community.

## Where the costs move

The biggest change is not that review becomes unnecessary. It is that producing a plausible change becomes cheaper. In [“Rethinking open source mentorship in the AI era”](https://github.blog/open-source/maintainers/rethinking-open-source-mentorship-in-the-ai-era/), GitHub's Abigail Cabunoc Mayes describes the resulting asymmetry: the cost of creating a pull request has fallen while the cost of reviewing it has not.

That changes the signals maintainers use. A polished description, tidy code and a passing basic test may no longer show how much the contributor understands about the problem or the surrounding system. A maintainer may have to review both the change and the contributor's understanding of it.

Mayes proposes three useful filters for mentorship:

1. **Comprehension:** Can the contributor explain the problem and the proposed change at an appropriate level?
2. **Context:** Does the contribution give the reviewer the issue, trade-offs, tests, limitations and disclosure needed to review it well?
3. **Continuity:** Does the contributor respond to feedback and keep engaging when the first version is not ready?

These are a framework, not a scorecard or a claim that every contributor must understand an entire project. They are a reminder that open source depends on knowledge transfer as well as code transfer.

There are other costs to keep visible:

- **Quality and maintenance:** A plausible implementation can still add unnecessary complexity, weak tests or an incorrect assumption about a lifecycle, API or user need.
- **Security:** An agent may suggest a package that does not exist, overstate a vulnerability or miss an interaction across trust boundaries. Generated tests can also repeat the same mistaken assumption as the generated code.
- **Provenance and licensing:** Tool output may have an unclear origin, and a project's contribution rules may require disclosure or prohibit particular uses. A public URL is not permission to copy code or prose.
- **Privacy and confidentiality:** Private source, credentials, customer information, issue details and unreleased plans must not be sent to an unapproved service.
- **Infrastructure and attention:** Automated issue, pull request and CI activity consumes maintainer time, API capacity and build resources. In [“Your contributors are AI-first now. Is your project?”](https://github.blog/open-source/maintainers/your-contributors-are-ai-first-now-is-your-project/), Andrea Griffiths reports AutoGPT's experience with rate limits, expensive review tooling and the need to audit unused authorisations.

These costs are not a verdict for or against every agent. They are constraints for designing a contribution workflow that remains trustworthy.

## Hashimoto's question: can the reviewer see the thinking?

In his [public announcement of Vouch](https://x.com/mitchellh/status/2020252149117313349), Mitchell Hashimoto says that AI eliminated the natural barrier to entry that let open-source projects trust by default. His [Vouch README](https://github.com/mitchellh/vouch) explains the older model in more detail: the effort needed to understand a codebase, implement a change and submit it for review filtered out many low-quality contributions. AI tools can now make a plausible-looking contribution quickly, without the same evidence of understanding. Hashimoto's response is not to abandon trust, but to make trust explicit.

That diagnosis also gives contributors a practical test: do not show only the finished patch. The useful distinction is not “AI used” versus “AI never used,” but assistance that remains under human direction versus output submitted without enough thought, verification or follow-through. Explain the problem you investigated, the approaches you considered, what the tool suggested, what you rejected, how you corrected the result and which checks you ran. A checkbox that says “AI used” may provide useful context, but it cannot by itself demonstrate comprehension or ownership. This does not mean publishing private prompts or an entire transcript; it means giving a reviewer enough context to assess your judgement rather than asking them to infer it from polished output alone.

Ghostty's [current AI usage policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md), maintained by Hashimoto's project, makes that standard concrete. It says that all AI use in outside contributions must be disclosed, that the human in the loop must fully understand the code, and that AI-assisted issues and discussions must be reviewed and edited by a human. The policy welcomes AI as a tool while setting strict rules for external contributions. That combination matters: the boundary is about the quality and accountability of the contribution, not a claim that maintainers themselves never use AI.

## A contributor's checklist

Before opening a pull request, make the human part visible:

1. **Read the project's rules.** Check `CONTRIBUTING.md`, the code of conduct, security guidance, issue templates and any `AGENTS.md` or equivalent instructions. Look for rules about generated content, disclosure, attribution and approved tools.
2. **Confirm the work is wanted.** If the project asks for an issue, discussion or maintainer approval first, do that before asking an agent to build a solution. It is cheaper to align on the problem than to review a complete solution to the wrong one.
3. **Keep the scope narrow.** State the problem, intended behaviour, non-goals and affected areas. Avoid submitting a large bundle of unrelated clean-up just because the tool found it.
4. **Understand every submitted line.** You should be able to explain the design, important branches, failure modes, test choices and trade-offs. If you cannot, pause and learn before submitting.
5. **Verify independently.** Inspect the diff and generated files. Run the project's tests, linters and relevant manual checks yourself. Do not report a test as passing because an agent said it passed.
6. **Check security and dependencies.** Review new packages, permissions, network calls, file access, error handling and secret handling. Use the project's security reporting route for a suspected vulnerability rather than putting sensitive details in a public pull request.
7. **Disclose as requested.** Name the tools or kind of assistance when the project asks for it. Do not invent a human co-author or a legal sign-off for a tool. Use the project's exact disclosure or attribution mechanism.
8. **Stay for the review.** Answer questions, revise the change and be ready to maintain it after merge. A pull request is an invitation to collaborate, not a delivery chute.

The Linux kernel's [AI Coding Assistants guidance](https://docs.kernel.org/process/coding-assistants.html) is a clear example of project-specific rules. It says that AI agents must not add `Signed-off-by`; the human submitter must review the work and provide their own DCO certification. It also asks for an `Assisted-by` tag when AI tools contribute. Those instructions are appropriate for the Linux kernel. They are not a universal template, which is why contributors must read the target project's policy.

## A maintainer's checklist

Maintainers cannot remove all uncertainty, but they can make the desired path easier to follow and easier to check.

- **Publish a short, explicit policy.** Say what is allowed, restricted, prohibited or disclosure-required. Explain whether the policy covers code, documentation, issues, reviews and security reports. Link to the canonical policy from the contribution guide.
- **Put instructions where contributors and tools can find them.** GitHub's [contribution-guidelines documentation](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors) explains how `CONTRIBUTING.md` is surfaced. `AGENTS.md` can add scoped repository instructions, but it should stay focused and current.
- **Use proportional gates.** An issue-first conversation, a useful pull request template, required tests and a clear reproduction request can add useful friction without banning every new contributor. Make an alternate route available for questions and non-code contributions.
- **Prefer checks that prove something.** Required CI, license checks, dependency checks, reproducible tests and a comparison between the pull request description and the actual diff are stronger first filters than trying to infer authorship from writing style.
- **Keep powerful actions human-controlled.** Do not give an agent broad merge, release, secret or production access. Sandbox untrusted changes, restrict network access where practical and review the permissions of GitHub Apps and other integrations.
- **Make review context part of the contribution.** Ask for the linked issue, design choices, tests, limitations and agent disclosure. The aim is not paperwork; it is to make the review possible without reconstructing the entire conversation behind the patch.
- **Use the 3 Cs deliberately.** Comprehension and context help decide whether a change is ready to review. Continuity helps identify where deeper mentorship may be worthwhile. This protects maintainer time without treating a first contribution as a permanent verdict on a person.
- **Protect the wider community.** Keep paths open for documentation, triage, design, testing, translation and community care. A response to low-quality code should not quietly define all contribution as code generation.

Hashimoto's [Vouch project](https://github.com/mitchellh/vouch) is a more structural response to the same pressure. Vouch lets a project require people to be explicitly vouched before they interact with selected project surfaces, and lets trusted project members denounce users. Its GitHub Actions can check issues and pull requests, while the vouch list remains a simple file in the repository.

Vouch is not a merge or release permission system. Its [FAQ](https://github.com/mitchellh/vouch/blob/main/FAQ.md) says that first-time contributors can introduce themselves and describe how they want to contribute, and that existing review and system controls still govern what can merge. That is an important limitation and a useful design choice: add a human introduction step without pretending that a trust gate replaces technical review.

The trade-off is real. Explicit trust can protect a small maintainer team from automated drive-by activity, but it adds friction and makes the project responsible for explaining how people can enter the community. Vouch's README calls the system experimental and leaves the policy and consequences to each integrating project. Treat it as one project's response to a particular scale and threat model, not as a default that every open source project should copy.

GitHub's January 2026 [discussion about low-quality contributions](https://github.com/orgs/community/discussions/185387) is useful background for this design problem. GitHub maintainer Camilla Moraes describes ideas under exploration, including more configurable pull-request permissions, issue-first criteria, better triage tools and clearer AI transparency. The discussion is an exploration, not a promise that every idea will ship, so projects should make their own policy decisions rather than wait for a platform-wide answer.

## Open source and internal work

The same principle applies in a public repository, a company repository and a private project: the person responsible for the change must understand and verify it. The risk boundary is different.

For open source, check the project's contribution, licence, disclosure, security and attribution rules. Do not assume that an agent's output is automatically compatible with the project's licence or community expectations.

For internal or proprietary work, also check the organisation's approved tools, data classification and retention rules. Do not put secrets, customer data, personal data, restricted source or unreleased plans into a service that has not been approved for that information. Use least privilege, keep the work auditable and ensure a human owner remains accountable for the release.

An agent can help with a private project without making private information safe to share. “Not public yet” is not the same as “safe for any tool.”

## There is no single policy

Projects are choosing different points on a spectrum:

- no generated contributions;
- limited assistance for learning, search, editing or low-risk work;
- AI-assisted work allowed with disclosure and human verification;
- agent-friendly workflows with issue-first gates, required checks and tightly scoped permissions.

These are governance choices, not a maturity ladder. A small project may choose a simple prohibition because it cannot review the risk. A security-sensitive project may allow a narrow, auditable workflow. A learning-focused project may permit assistance but require the contributor to explain the result.

[Melissa Wolf's community-maintained policy index](https://github.com/melissawm/open-source-ai-contribution-policies) shows how varied these choices are. The index explicitly warns that its classifications are a general guide, not a source of truth. Use it to find examples, then open and follow the target project's current canonical policy.

The practical test for any policy is whether a good-faith contributor can discover it, understand it and comply with it—and whether maintainers can apply it consistently. Rules that are invisible, vague or impossible to staff create a second problem even when their intent is sound.

## Open questions and limits

The sources above describe current practices and reported experiences, not a universal productivity study. The balance between speed, quality, learning, privacy, licensing and maintainer capacity will vary by project and may change as tools and policies change.

The GitHub articles are reports from GitHub and its interviewees, not independent evidence that every project should copy AutoGPT's workflow. The OpenSSF guide is practical security guidance, not a substitute for a project's threat model. The Linux page is the Linux kernel's rule set, not a general legal standard. Ghostty's policy and Vouch are project-specific responses. The policy index is useful for discovery but is explicitly non-authoritative.

This guide also does not decide whether a particular tool, model, licence or data flow is approved for an organisation. That decision belongs with the relevant project, security, privacy, legal or editorial owner.

## Take the next step

For your next agent-assisted contribution, choose one small, well-defined task. Read the project's rules, confirm the problem with the community, work with least privilege, inspect every change and prepare a pull request that explains what you checked and what remains uncertain.

For a project you maintain, start with one clear paragraph in `CONTRIBUTING.md` and one machine-checkable gate. Make the human responsibility explicit, keep the route welcoming and review the policy when the workflow changes.

### Sources checked on 16 September 2026

- [Abigail Cabunoc Mayes, “Rethinking open source mentorship in the AI era”](https://github.blog/open-source/maintainers/rethinking-open-source-mentorship-in-the-ai-era/) — GitHub, 19 March 2026.
- [Andrea Griffiths, “Your contributors are AI-first now. Is your project?”](https://github.blog/open-source/maintainers/your-contributors-are-ai-first-now-is-your-project/) — GitHub, 12 August 2026.
- [Gregg Cochran, “What 50 open source projects taught us about security in the AI era”](https://github.blog/open-source/maintainers/what-50-open-source-projects-taught-us-about-security-in-the-ai-era/) — GitHub, 13 August 2026.
- [“Securing Open Source in the Age of AI: A Practical Guide”](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/) — OpenSSF and CNCF, updated 19 May 2026.
- [Mitchell Hashimoto's Vouch README](https://github.com/mitchellh/vouch) and [Vouch FAQ](https://github.com/mitchellh/vouch/blob/main/FAQ.md) — project documentation.
- [Mitchell Hashimoto's public announcement of Vouch](https://x.com/mitchellh/status/2020252149117313349) — direct statement on AI, default trust and explicit trust, 7 February 2026.
- [Ghostty AI Usage Policy](https://github.com/ghostty-org/ghostty/blob/main/AI_POLICY.md) — current project policy maintained by the Ghostty project.
- [“AI Coding Assistants”](https://docs.kernel.org/process/coding-assistants.html) — Linux kernel documentation.
- [“Exploring Solutions to Tackle Low-Quality Contributions on GitHub”](https://github.com/orgs/community/discussions/185387) — GitHub Community discussion started by Camilla Moraes, 27 January 2026.
- [Open-source AI contribution policies](https://github.com/melissawm/open-source-ai-contribution-policies) — community-maintained index; classifications are explicitly non-authoritative.
