<script lang="ts">
  import axios from "axios";
  import { ApiClient } from "./api";
  const apiClient = new ApiClient(axios.create({
    baseURL: "https://petstore.swagger.io/v2",
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  }));
  async function getInventory() {
    const response = await apiClient.store.getInventory();
    console.log(response.sold);
  }
</script>

<pre>
  <code>
    {JSON.stringify(getInventory(), null, 2)}
  </code>
</pre>
