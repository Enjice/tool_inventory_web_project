# Tool Inventory Management System

A modern React application for managing your tool inventory with Supabase integration.

## Features

- ✅ Full CRUD operations for tools
- ✅ Favorite tools functionality
- ✅ Real-time updates
- ✅ Responsive design with Tailwind CSS
- ✅ Type-safe with TypeScript
- ✅ Clean architecture with separation of concerns
- ✅ Loading states and error handling
- ✅ Empty state UI
- ✅ ESLint + Prettier configured

## Tech Stack

- React 18 with TypeScript
- Vite for build tooling
- Supabase for backend
- React Router v6 for routing
- Tailwind CSS for styling
- API calls

## Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── LoadingSpinner.tsx
│   │   └── ...
│   ├── tools/
│   │   ├── ToolForm.tsx
│   │   ├── ToolList.tsx
│   │   └── ...
│   └── ...
├── hooks/
│   └── useTools.ts
├── pages/
│   ├── CatalogPage.tsx
│   ├── ToolFormPage.tsx
│   ├── FavoritesPage.tsx
│   └── ...
├── types.ts
├── App.tsx
├── main.tsx
└── ...
```

## Роутинг

В `App.tsx` настроены маршруты на страницы:
- `/` — `CatalogPage`
- `/add` — `ToolFormPage` для создания
- `/edit/:id` — `ToolFormPage` для редактирования
- `/favorites` — `FavoritesPage`
