<script>
	// core components
	import TableDropdown from '$lib/Dropdowns/TableDropdown.svelte';

	const bootstrap = '../../assets/img/bootstrap.jpg';
	const angular = '../../assets/img/angular.jpg';
	const sketch = '../../assets/img/sketch.jpg';
	const react = '../../assets/img/react.jpg';
	const vue = '../../assets/img/react.jpg';

	const team1 = '../../assets/img/team-1-800x800.jpg';
	const team2 = '../../assets/img/team-2-800x800.jpg';
	const team3 = '../../assets/img/team-3-800x800.jpg';
	const team4 = '../../assets/img/team-4-470x470.png';

	// can be one of light or dark
	export let color = 'light';
</script>

<div
	class="relative mb-6 flex w-full min-w-0 flex-col break-words rounded shadow-lg {color === 'light'
		? 'bg-white'
		: 'bg-red-800 text-white'}"
>
	<div class="mb-0 rounded-t border-0 px-4 py-3">
		<div class="flex flex-wrap items-center">
			<div class="relative w-full max-w-full flex-1 flex-grow px-4">
				<h3 class="text-lg font-semibold {color === 'light' ? 'text-blueGray-700' : 'text-white'}">
					Card Tables
				</h3>
			</div>
		</div>
	</div>
	<div class="block w-full overflow-x-auto">
		<!-- Projects table -->
		<table class="w-full border-collapse items-center bg-transparent">
			<thead>
				<tr>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					>
						Project
					</th>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					>
						Budget
					</th>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					>
						Status
					</th>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					>
						Users
					</th>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					>
						Completion
					</th>
					<th
						class="whitespace-nowrap border border-l-0 border-r-0 border-solid px-6 py-3 text-left align-middle text-xs font-semibold uppercase {color ===
						'light'
							? 'bg-blueGray-50 text-blueGray-500 border-blueGray-100'
							: 'border-red-600 bg-red-700 text-red-200'}"
					></th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<th
						class="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
					>
						<img src={bootstrap} class="h-12 w-12 rounded-full border bg-white" alt="..." />
						<span class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}">
							Argon Design System
						</span>
					</th>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						$2,500 USD
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<i class="fas fa-circle mr-2 text-orange-500"></i> pending
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex">
							<img
								src={team1}
								alt="..."
								class="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team2}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team3}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team4}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex items-center">
							<span class="mr-2">60%</span>
							<div class="relative w-full">
								<div class="flex h-2 overflow-hidden rounded bg-red-200 text-xs">
									<div
										style="width: 60%;"
										class="flex flex-col justify-center whitespace-nowrap bg-red-500 text-center text-white shadow-none"
									></div>
								</div>
							</div>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs"
					>
						<TableDropdown />
					</td>
				</tr>
				<tr>
					<th
						class="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
					>
						<img src={angular} class="h-12 w-12 rounded-full border bg-white" alt="..." />
						<span class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}">
							Angular Now UI Kit PRO
						</span>
					</th>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						$1,800 USD
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<i class="fas fa-circle mr-2 text-emerald-500"></i>
						completed
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex">
							<img
								src={team1}
								alt="..."
								class="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team2}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team3}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team4}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex items-center">
							<span class="mr-2">100%</span>
							<div class="relative w-full">
								<div class="flex h-2 overflow-hidden rounded bg-emerald-200 text-xs">
									<div
										style="width: 100%;"
										class="flex flex-col justify-center whitespace-nowrap bg-emerald-500 text-center text-white shadow-none"
									></div>
								</div>
							</div>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs"
					>
						<TableDropdown />
					</td>
				</tr>
				<tr>
					<th
						class="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
					>
						<img src={sketch} class="h-12 w-12 rounded-full border bg-white" alt="..." />
						<span class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}">
							Black Dashboard Sketch
						</span>
					</th>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						$3,150 USD
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<i class="fas fa-circle mr-2 text-red-500"></i> delayed
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex">
							<img
								src={team1}
								alt="..."
								class="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team2}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team3}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team4}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex items-center">
							<span class="mr-2">73%</span>
							<div class="relative w-full">
								<div class="flex h-2 overflow-hidden rounded bg-red-200 text-xs">
									<div
										style="width: 73%;"
										class="flex flex-col justify-center whitespace-nowrap bg-red-500 text-center text-white shadow-none"
									></div>
								</div>
							</div>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs"
					>
						<TableDropdown />
					</td>
				</tr>
				<tr>
					<th
						class="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
					>
						<img src={react} class="h-12 w-12 rounded-full border bg-white" alt="..." />
						<span class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}">
							React Material Dashboard
						</span>
					</th>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						$4,400 USD
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<i class="fas fa-circle mr-2 text-teal-500"></i> on schedule
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex">
							<img
								src={team1}
								alt="..."
								class="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team2}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team3}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team4}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex items-center">
							<span class="mr-2">90%</span>
							<div class="relative w-full">
								<div class="flex h-2 overflow-hidden rounded bg-teal-200 text-xs">
									<div
										style="width: 90%;"
										class="flex flex-col justify-center whitespace-nowrap bg-teal-500 text-center text-white shadow-none"
									></div>
								</div>
							</div>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs"
					>
						<TableDropdown />
					</td>
				</tr>
				<tr>
					<th
						class="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-left align-middle text-xs"
					>
						<img src={vue} class="h-12 w-12 rounded-full border bg-white" alt="..." />
						<span class="ml-3 font-bold {color === 'light' ? 'btext-blueGray-600' : 'text-whit'}">
							React Material Dashboard
						</span>
					</th>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						$2,200 USD
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<i class="fas fa-circle mr-2 text-emerald-500"></i>
						completed
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex">
							<img
								src={team1}
								alt="..."
								class="border-blueGray-50 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team2}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team3}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
							<img
								src={team4}
								alt="..."
								class="border-blueGray-50 -ml-4 h-10 w-10 rounded-full border-2 shadow"
							/>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 align-middle text-xs"
					>
						<div class="flex items-center">
							<span class="mr-2">100%</span>
							<div class="relative w-full">
								<div class="flex h-2 overflow-hidden rounded bg-emerald-200 text-xs">
									<div
										style="width: 100%;"
										class="flex flex-col justify-center whitespace-nowrap bg-emerald-500 text-center text-white shadow-none"
									></div>
								</div>
							</div>
						</div>
					</td>
					<td
						class="whitespace-nowrap border-l-0 border-r-0 border-t-0 p-4 px-6 text-right align-middle text-xs"
					>
						<TableDropdown />
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
