# 🦙 X Llama: A Vite + Vue + SCSS Project

Welcome to X Llama! 🦙 This project is a Vite + Vue + SCSS platform where the sidebar layout is inspired by modern design trends, and fonts/icons are sourced from Google Fonts. The project is part of an Object-Oriented Programming course and focuses on building a conversational platform for large language models. 💬🤖

## 🚀 Project Overview

X Llama offers two user roles: System Administrators and Regular Users. At its core, the platform revolves around a Bot Module for user interactions, featuring both official bots and customizable ones.

### ⚙️ Basic Features (75%)

#### 👥 User Roles:
- **System Administrators:** Can manage bots, set limits, pricing, and control user access.
- **Regular Users:** Can create conversations with bots and customize their own bots.

#### 🤖 Bot Module:
- **Official Bots:** Includes models like ChatGPT-3.5 turbo, ChatGPT-4o, and ChatGPT-4o-mini.
- **Custom Bots:** Users can build bots with specific functions, such as translation, image generation, and math calculations.

#### 🛠️ Administrator Module:
- Admins can add/modify bots, set pricing, manage quotas for custom bots, and export stats (e.g., users, bots, revenue).

#### 💬 Conversation Module:
- Supports single-turn and multi-turn Q&A. Responses are streamed in real-time with context-clearing features.

#### 👤 User Information Module:
- Includes profile management, usage statistics, and bot ratings. Users can showcase their bots on their homepage.

#### 💸 Marketplace Module:
- Users can purchase tokens to interact with bots. If tokens run out, users revert to the free bot (ChatGPT-3.5 turbo).

#### 🔍 Search Module:
- Fuzzy search functionality for users and bots.

#### ⭐ Ratings/Posts Module:
- Users can rate and comment on bots or other users’ profiles. Admins can export bot ratings and user data.

### 🌟 Advanced Features (25%)

#### 📈 Popularity Rankings:
- Display and rank the top bots by ratings and visits.

#### ⚙️ Advanced Custom Bot Settings:
- Enhance bots with external knowledge bases, custom prompts, and improved interaction tools.

#### 🧠 Recommendations:
- Suggest bots based on users' frequently used types or topics.

#### 📁 Multiple Query Formats:
- Supports text, image, file, and voice inputs.

#### 🔧 Prompt Refinement:
- Provides advanced prompts to improve the quality of user queries.

## 🛠️ How to Run the Project

### 📦 Install dependencies:
```bash
npm i
```
### 🚀 Run the development server:
```bash
npm run dev
```

## Reference
The sidebar design in this project is inspired by Tyler Potts' Vue sidebar tutorial. You can find the original source on GitHub [here](https://github.com/TylerPottsDev/yt-vue-sidebar).
