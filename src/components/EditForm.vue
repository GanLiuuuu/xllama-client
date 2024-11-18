<template>
    <form>
      <div class="space-y-12">
        <div class="border-b border-white/10 pb-12">
          <h2 class="text-base/7 font-semibold text-white">Profile</h2>
          <p class="mt-1 text-sm/6 text-gray-400">This information will be displayed publicly so be careful what you share.</p>
  
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-4">
              <label for="username" class="block text-sm/6 font-medium text-white">Username</label>
              <div class="mt-2">
                <div class="flex rounded-md bg-white/5 ring-1 ring-inset ring-white/10 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
                  <span class="flex select-none items-center pl-3 text-gray-500 sm:text-sm">workcation.com/</span>
                  <input type="text" name="username" id="username" autocomplete="username" class="flex-1 border-0 bg-transparent py-1.5 pl-1 text-white focus:ring-0 sm:text-sm/6" placeholder="janesmith" />
                </div>
              </div>
            </div>
  
            <div class="col-span-full">
              <label for="about" class="block text-sm/6 font-medium text-white">About</label>
              <div class="mt-2">
                <textarea id="about" name="about" rows="3" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
              </div>
              <p class="mt-3 text-sm/6 text-gray-400">Write a few sentences about yourself.</p>
            </div>
  
            <div class="col-span-full">
              <label for="photo" class="block text-sm/6 font-medium text-white">Photo</label>
              <div class="mt-2 flex items-center gap-x-3">
                <UserCircleIcon class="size-12 text-gray-500" aria-hidden="true" />
                <button type="button" class="rounded-md bg-white/10 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/20">Change</button>
              </div>
            </div>
  
            <div class="col-span-full">
              <label for="cover-photo" class="block text-sm/6 font-medium text-white">Cover photo</label>
              <div class="mt-2 flex justify-center rounded-lg border border-dashed border-white/25 px-6 py-10">
                <div class="text-center">
                  <PhotoIcon class="mx-auto size-12 text-gray-500" aria-hidden="true" />
                  <div class="mt-4 flex text-sm/6 text-gray-400">
                    <label for="file-upload" class="relative cursor-pointer rounded-md bg-gray-900 font-semibold text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" />
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs/5 text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <div class="border-b border-white/10 pb-12">
          <h2 class="text-base/7 font-semibold text-white">Personal Information</h2>
          <p class="mt-1 text-sm/6 text-gray-400">Use a permanent address where you can receive mail.</p>
  
          <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div class="sm:col-span-3">
              <label for="first-name" class="block text-sm/6 font-medium text-white">First name</label>
              <div class="mt-2">
                <input type="text" name="first-name" id="first-name" autocomplete="given-name" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
              </div>
            </div>
  
            <div class="sm:col-span-3">
              <label for="last-name" class="block text-sm/6 font-medium text-white">Last name</label>
              <div class="mt-2">
                <input type="text" name="last-name" id="last-name" autocomplete="family-name" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
              </div>
            </div>
  
            <div class="sm:col-span-4">
              <label for="email" class="block text-sm/6 font-medium text-white">Email address</label>
              <div class="mt-2">
                <input id="email" name="email" type="email" autocomplete="email" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
              </div>
            </div>
  
            <div class="sm:col-span-3">
              <label for="country" class="block text-sm/6 font-medium text-white">Country</label>
              <div class="mt-2">
                <select id="country" name="country" autocomplete="country-name" class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6 [&_*]:text-black">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>Mexico</option>
                </select>
              </div>
            </div>

  

          </div>
        </div>

      </div>
  
      <div class="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" class="text-sm/6 font-semibold text-white">Cancel</button>
        <button type="submit" class="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">Save</button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { PhotoIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
  </script>