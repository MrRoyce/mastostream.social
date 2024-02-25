<script>
  import { Dropdown, DropdownItem } from 'flowbite-svelte';
  import {
    ChevronDown,
    Globe,
    Globe_Africa,
    Globe_Asia,
    Globe_Europe,
  } from '$lib/components/icons';

  // const countries = [
  //   { value: 'de', name: 'German' },
  //   { value: 'en', name: 'English' },
  //   { value: 'es', name: 'Spanish' },
  //   { value: 'fr', name: 'French' },
  //   { value: 'hi', name: 'Hindi' },
  //   { value: 'ja', name: 'Japanese' },
  //   { value: 'pt', name: 'Portuguese' },
  //   { value: 'sv', name: 'Swedish' },
  //   { value: 'tl', name: 'Philipino' },
  //   { value: 'zu', name: 'Zulu' },
  // ];
</script>

<div class="flex">
  <button
    id="flags-button"
    class="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-gray-500 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
    type="button"
  >
    <Globe />
    <span class="pl-4"><ChevronDown /></span>
  </button>
  <Dropdown triggeredBy="#flags-button">
    <DropdownItem class="flex items-center">
      <Globe_Europe />
      <span class="text-white pl-4">Deutsch</span>
    </DropdownItem>
    <DropdownItem class="flex items-center">
      <Globe_Europe />
      <span class="text-white pl-4">Español</span>
    </DropdownItem>
    <DropdownItem class="flex items-center">
      <Globe />
      <span class="text-white pl-4">English</span>
    </DropdownItem>
    <DropdownItem class=" flex items-center">
      <Globe_Europe />
      <span class="text-white pl-4">Français</span>
    </DropdownItem>
    <DropdownItem class="flex items-center">
      <Globe_Asia />
      <span class="text-white pl-4">हिंदी</span>
    </DropdownItem>
    <DropdownItem class="flex items-center">
      <Globe_Asia />
      <span class="text-white pl-4">日本語</span>
    </DropdownItem>
    <DropdownItem class=" flex items-center">
      <Globe_Europe />
      <span class="text-white pl-4">Português</span>
    </DropdownItem>
    <DropdownItem class=" flex items-center">
      <Globe_Europe />
      <span class="text-white pl-4">Svenska</span>
    </DropdownItem>
    <DropdownItem class=" flex items-center">
      <Globe_Asia />
      <span class="text-white pl-4">Filipino</span>
    </DropdownItem>
    <DropdownItem class=" flex items-center">
      <Globe_Africa />
      <span class="text-white pl-4">Zulu</span>
    </DropdownItem>
  </Dropdown>
</div>
