---
id: space-categories
title: Categories
sidebar_label: Categories
sidebar_position: 2.5
---

# Categories

**Space › Discover › Categories** groups the apps by category. Click a card to open the store
filtered to that category. A category is the project's distribution label: the agent groups
projects in the same category together.

**Permission level:** Any signed-in user browses. Creating, editing, and deleting categories
needs the `manage-categories` role (part of `system-administrator`).

## Managing categories

With `manage-categories`, the page shows **New category**, and each category card shows **Edit**
and **Delete**. Empty categories are listed too, so you can fill them.

| Field | Notes |
|---|---|
| **Name** | Required, unique, up to 255 characters. Any language works — Hebrew, English, or mixed |
| **Description** | Optional, up to 500 characters. Shown on the category card |
| **Projects** | The projects in this category. A project has one category, so adding a project that is in another category moves it here — the dialog lists those moves before you save |

- **Renaming** a category that projects already use shows a warning: the new name is what agents
  receive, so agent rules that match the old name stop matching.
- **Deleting** works only for a category with no projects. Remove its projects first.

Project owners pick a category in the project's **General** settings, but only from the
categories that exist here — see [Categories](../developer/project/new-project#categories).

## API

| Method | Path | Role |
|---|---|---|
| `GET` | `/api/project/labels` | `view-project`, `view-workspace`, or `view-offering` |
| `POST` | `/api/project/labels` | `manage-categories` |
| `PUT` | `/api/project/labels/{id}` | `manage-categories` — sending `projectIds` sets exactly those projects |
| `DELETE` | `/api/project/labels/{id}` | `manage-categories` |
